import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Mail } from "lucide-react";

const RegistrationSuccess = () => {
  const [registrationData, setRegistrationData] = useState<{
    name: string;
    rollNumber: string;
  } | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const rollNumber = urlParams.get('rollNumber');
    
    if (name && rollNumber) {
      setRegistrationData({ name, rollNumber });
      
      // Simulate sending confirmation email
      console.log('Sending confirmation email to:', name, 'with roll number:', rollNumber);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Registered Successfully!
          </h1>
          
          {registrationData && (
            <div className="bg-card p-6 rounded-2xl border border-primary/10 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Registration Details</h2>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium text-foreground">{registrationData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Roll Number:</span>
                  <span className="font-medium text-foreground">{registrationData.rollNumber}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <Mail className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-800">Confirmation Email Sent</span>
            </div>
            <p className="text-sm text-blue-700">
              A confirmation email with your registration details has been sent to your email address.
            </p>
          </div>
          
          <div className="space-y-3">
            <p className="text-muted-foreground">
              Thank you for registering! We'll contact you soon with event updates and further instructions.
            </p>
            
            <Button 
              onClick={() => window.location.href = '/'}
              variant="hero-primary"
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;