// iOS UPI Payment Integration with comprehensive device compatibility

export interface UPIPaymentData {
  upiId: string;
  amount: string;
  name: string;
  note: string;
}

// Detect device and OS information
export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
  const isChrome = /chrome/.test(userAgent);
  const isInAppBrowser = /instagram|facebook|twitter|linkedin|whatsapp/.test(userAgent);
  
  // Get iOS version for compatibility checks
  const iosVersionMatch = userAgent.match(/os (\d+)_(\d+)_?(\d+)?/);
  const iosVersion = iosVersionMatch ? {
    major: parseInt(iosVersionMatch[1]),
    minor: parseInt(iosVersionMatch[2]),
    patch: parseInt(iosVersionMatch[3] || '0')
  } : null;

  return {
    isIOS,
    isAndroid,
    isSafari,
    isChrome,
    isInAppBrowser,
    iosVersion,
    isMobile: isIOS || isAndroid,
    userAgent
  };
};

// Create UPI payment URL with proper encoding
export const createUPIUrl = (paymentData: UPIPaymentData): string => {
  const { upiId, amount, name, note } = paymentData;
  
  // Encode parameters properly for URL
  const encodedName = encodeURIComponent(name);
  const encodedNote = encodeURIComponent(note);
  
  return `upi://pay?pa=${upiId}&am=${amount}&tn=${encodedNote}&pn=${encodedName}&cu=INR`;
};

// Create fallback web UPI URL for browsers
export const createWebUPIUrl = (paymentData: UPIPaymentData): string => {
  const { upiId, amount, name, note } = paymentData;
  
  // Some UPI apps support web URLs
  return `https://upiweb.in/pay?pa=${upiId}&am=${amount}&tn=${encodeURIComponent(note)}&pn=${encodeURIComponent(name)}&cu=INR`;
};

// iOS-specific UPI app deep links
export const getIOSUPIApps = (paymentData: UPIPaymentData) => {
  const { upiId, amount, name, note } = paymentData;
  const encodedNote = encodeURIComponent(note);
  const encodedName = encodeURIComponent(name);

  return [
    {
      name: 'PhonePe',
      scheme: `phonepe://pay?pa=${upiId}&am=${amount}&tn=${encodedNote}&pn=${encodedName}`,
      fallback: `https://phon.pe/ru_${upiId}_${amount}_${encodedNote}`
    },
    {
      name: 'Google Pay',
      scheme: `tez://upi/pay?pa=${upiId}&am=${amount}&tn=${encodedNote}&pn=${encodedName}`,
      fallback: `https://pay.google.com/gp/v/save/${upiId}`
    },
    {
      name: 'Paytm',
      scheme: `paytmmp://pay?pa=${upiId}&am=${amount}&tn=${encodedNote}&pn=${encodedName}`,
      fallback: `https://paytm.me/pay?pa=${upiId}&am=${amount}`
    },
    {
      name: 'BHIM',
      scheme: `bhim://pay?pa=${upiId}&am=${amount}&tn=${encodedNote}&pn=${encodedName}`,
      fallback: createUPIUrl(paymentData)
    }
  ];
};

// Handle iOS UPI payment with comprehensive fallbacks
export const initiateIOSUPIPayment = async (paymentData: UPIPaymentData): Promise<boolean> => {
  const deviceInfo = getDeviceInfo();
  
  if (!deviceInfo.isIOS) {
    return initiateAndroidUPIPayment(paymentData);
  }

  const upiUrl = createUPIUrl(paymentData);
  const upiApps = getIOSUPIApps(paymentData);

  try {
    // Method 1: Try standard UPI URL first
    const success = await tryOpenUPIUrl(upiUrl);
    if (success) return true;

    // Method 2: Try specific app deep links
    for (const app of upiApps) {
      const appSuccess = await tryOpenUPIUrl(app.scheme);
      if (appSuccess) return true;
    }

    // Method 3: Use iOS universal links
    const universalLinkSuccess = await tryUniversalLinks(paymentData);
    if (universalLinkSuccess) return true;

    // Method 4: Fallback to web UPI
    return await tryWebUPIFallback(paymentData);

  } catch (error) {
    console.error('iOS UPI payment failed:', error);
    return false;
  }
};

// Handle Android UPI payment
export const initiateAndroidUPIPayment = async (paymentData: UPIPaymentData): Promise<boolean> => {
  const upiUrl = createUPIUrl(paymentData);
  
  try {
    // Android generally handles UPI URLs better
    window.location.href = upiUrl;
    
    // Fallback after a delay
    setTimeout(() => {
      if (document.hasFocus()) {
        const paymentWindow = window.open(upiUrl, '_blank');
        if (!paymentWindow) {
          tryWebUPIFallback(paymentData);
        }
      }
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Android UPI payment failed:', error);
    return tryWebUPIFallback(paymentData);
  }
};

// Try to open UPI URL and detect if successful
const tryOpenUPIUrl = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    // Create a hidden iframe to test the URL
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    
    // Also try direct location change
    try {
      window.location.href = url;
    } catch (e) {
      // Ignore errors
    }
    
    // Check if app opened (user left the page)
    const checkInterval = setInterval(() => {
      if (document.hidden || Date.now() - startTime > 2000) {
        clearInterval(checkInterval);
        document.body.removeChild(iframe);
        resolve(true);
      }
    }, 100);
    
    // Timeout after 3 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      if (iframe.parentNode) {
        document.body.removeChild(iframe);
      }
      resolve(false);
    }, 3000);
  });
};

// Try iOS universal links for UPI apps
const tryUniversalLinks = async (paymentData: UPIPaymentData): Promise<boolean> => {
  const { upiId, amount, note } = paymentData;
  
  const universalLinks = [
    `https://phonepe.com/pay?pa=${upiId}&am=${amount}&tn=${encodeURIComponent(note)}`,
    `https://pay.google.com/gp/v/save/${upiId}?amount=${amount}`,
    `https://paytm.me/pay?pa=${upiId}&am=${amount}`
  ];

  for (const link of universalLinks) {
    try {
      const success = await tryOpenUPIUrl(link);
      if (success) return true;
    } catch (e) {
      continue;
    }
  }
  
  return false;
};

// Web UPI fallback for browsers
const tryWebUPIFallback = async (paymentData: UPIPaymentData): Promise<boolean> => {
  const webUrl = createWebUPIUrl(paymentData);
  
  try {
    const paymentWindow = window.open(webUrl, '_blank', 'width=400,height=600');
    
    if (!paymentWindow) {
      // If popup blocked, try direct navigation
      window.location.href = webUrl;
    }
    
    return true;
  } catch (error) {
    console.error('Web UPI fallback failed:', error);
    return false;
  }
};

// Main UPI payment function
export const processUPIPayment = async (paymentData: UPIPaymentData): Promise<{
  success: boolean;
  method: string;
  fallback?: () => void;
}> => {
  const deviceInfo = getDeviceInfo();
  
  let success = false;
  let method = 'unknown';
  
  if (deviceInfo.isIOS) {
    success = await initiateIOSUPIPayment(paymentData);
    method = 'ios';
  } else if (deviceInfo.isAndroid) {
    success = await initiateAndroidUPIPayment(paymentData);
    method = 'android';
  } else {
    // Desktop fallback
    success = await tryWebUPIFallback(paymentData);
    method = 'web';
  }
  
  return {
    success,
    method,
    fallback: success ? undefined : () => showManualPaymentInstructions(paymentData)
  };
};

// Show manual payment instructions
export const showManualPaymentInstructions = (paymentData: UPIPaymentData) => {
  const { upiId, amount, note } = paymentData;
  
  const instructions = `
🔔 Payment Instructions:

📱 UPI ID: ${upiId}
💰 Amount: ₹${amount}
📝 Reference: ${note}

Steps:
1. Open any UPI app (PhonePe, Paytm, Google Pay, BHIM, etc.)
2. Send ₹${amount} to UPI ID: ${upiId}
3. Add reference: ${note}
4. Complete the payment
5. Keep the transaction screenshot for your records

Note: Payment confirmation may take a few minutes to reflect.
  `;
  
  if (navigator.share) {
    navigator.share({
      title: 'UPI Payment Instructions',
      text: instructions
    }).catch(() => {
      copyToClipboardFallback(instructions);
    });
  } else {
    copyToClipboardFallback(instructions);
  }
};

// Copy to clipboard fallback
const copyToClipboardFallback = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Payment instructions copied to clipboard!');
    }).catch(() => {
      showInstructionsAlert(text);
    });
  } else {
    showInstructionsAlert(text);
  }
};

// Show instructions in alert as final fallback
const showInstructionsAlert = (instructions: string) => {
  alert(instructions);
};