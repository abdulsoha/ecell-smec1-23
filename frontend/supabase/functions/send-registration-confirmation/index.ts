import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

interface RegistrationEmailData {
  name: string
  email: string
  roll_number: string
  event_name: string
  payment_status: string
  timestamp: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    })
  }

  try {
    const { name, email, roll_number, event_name, payment_status, timestamp }: RegistrationEmailData = await req.json()

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set')
      return new Response(JSON.stringify({ error: 'Email service not configured' }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Email template for registration confirmation
    const emailSubject = payment_status === 'completed' 
      ? `🎉 Registration Confirmed - ${event_name}`
      : `📝 Registration Received - ${event_name}`
    
    const emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Registration ${payment_status === 'completed' ? 'Confirmation' : 'Received'}</title>
          <style>
              body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8f9fa; padding: 30px 20px; border-radius: 0 0 10px 10px; }
              .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
              .confirmed { background: #d4edda; color: #155724; }
              .pending { background: #fff3cd; color: #856404; }
              .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
              .cta-button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
          </style>
      </head>
      <body>
          <div class="header">
              <h1>🚀 E-Cell SMEC</h1>
              <h2>Registration ${payment_status === 'completed' ? 'Confirmed!' : 'Received'}</h2>
          </div>
          
          <div class="content">
              <p>Hello <strong>${name}</strong>,</p>
              
              ${payment_status === 'completed' ? `
                  <div class="status-badge confirmed">✅ Payment Confirmed</div>
                  <p>Congratulations! Your registration for <strong>${event_name}</strong> has been confirmed. Your payment has been successfully processed.</p>
              ` : `
                  <div class="status-badge pending">⏳ Payment Pending</div>
                  <p>Thank you for registering for <strong>${event_name}</strong>. We have received your registration and are waiting for payment confirmation.</p>
              `}
              
              <div class="details">
                  <h3>📋 Registration Details</h3>
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Roll Number:</strong> ${roll_number}</p>
                  <p><strong>Event:</strong> ${event_name}</p>
                  <p><strong>Status:</strong> ${payment_status === 'completed' ? 'Confirmed' : 'Pending Payment'}</p>
                  <p><strong>Registration Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
              </div>
              
              ${payment_status === 'completed' ? `
                  <h3>🎯 What's Next?</h3>
                  <ul>
                      <li>📧 You will receive event updates via email</li>
                      <li>📱 Follow our social media for announcements</li>
                      <li>🤝 Join our WhatsApp group (link will be shared soon)</li>
                      <li>📅 Mark your calendar for upcoming events</li>
                  </ul>
                  
                  <div style="text-align: center;">
                      <a href="https://ecellsmec.com" class="cta-button">Visit Our Website</a>
                  </div>
              ` : `
                  <h3>💳 Complete Your Payment</h3>
                  <p>To confirm your registration, please complete the payment process. If you've already paid, please allow some time for confirmation.</p>
                  <p>For any payment issues, contact us at <strong>ecell.smec@gmail.com</strong></p>
              `}
              
              <div class="footer">
                  <p>Best regards,<br>
                  <strong>Team E-Cell SMEC</strong></p>
                  <p>📧 ecell.smec@gmail.com | 🌐 ecellsmec.com</p>
                  <p><em>Entrepreneurship Cell | St. Martin's Engineering College</em></p>
              </div>
          </div>
      </body>
      </html>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'noreply@ecellsmec.com',
        to: [email],
        cc: ['ecell.smec@gmail.com'], // Copy admin on confirmations
        subject: emailSubject,
        html: emailBody,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('Failed to send registration email:', error)
      return new Response(JSON.stringify({ error: 'Failed to send email' }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const data = await res.json()
    console.log('Registration email sent successfully:', data)

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in send-registration-confirmation function:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})