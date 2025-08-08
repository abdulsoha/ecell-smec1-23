import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"
import { corsHeaders } from '../_shared/cors.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

interface AdminConfirmPaymentData {
  registration_id: string
  admin_email: string
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
    const { registration_id, admin_email }: AdminConfirmPaymentData = await req.json()

    if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Required environment variables not set')
      return new Response(JSON.stringify({ error: 'Service not configured' }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Initialize Supabase client with service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Get registration details
    const { data: registration, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', registration_id)
      .single()

    if (fetchError || !registration) {
      return new Response(JSON.stringify({ error: 'Registration not found' }), { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Update payment status to confirmed
    const { error: updateError } = await supabase
      .from('registrations')
      .update({ 
        payment_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', registration_id)

    if (updateError) {
      console.error('Failed to update payment status:', updateError)
      return new Response(JSON.stringify({ error: 'Failed to update payment status' }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Send confirmation email to user
    const emailSubject = `🎉 Registration Confirmed - ${registration.event_name}`
    
    const emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Registration Confirmed</title>
          <style>
              body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8f9fa; padding: 30px 20px; border-radius: 0 0 10px 10px; }
              .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; background: #d4edda; color: #155724; }
              .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
              .cta-button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
          </style>
      </head>
      <body>
          <div class="header">
              <h1>🚀 E-Cell SMEC</h1>
              <h2>Registration Confirmed!</h2>
          </div>
          
          <div class="content">
              <p>Hello <strong>${registration.name}</strong>,</p>
              
              <div class="status-badge">✅ Payment Confirmed by E-Cell Team</div>
              <p>Congratulations! Your registration for <strong>${registration.event_name}</strong> has been confirmed by our team. Your payment has been verified and processed.</p>
              
              <div class="details">
                  <h3>📋 Registration Details</h3>
                  <p><strong>Name:</strong> ${registration.name}</p>
                  <p><strong>Email:</strong> ${registration.email}</p>
                  <p><strong>Roll Number:</strong> ${registration.roll_number}</p>
                  <p><strong>Department:</strong> ${registration.department}</p>
                  <p><strong>Year:</strong> ${registration.year}</p>
                  <p><strong>Event:</strong> ${registration.event_name}</p>
                  <p><strong>Status:</strong> Confirmed ✅</p>
                  <p><strong>Confirmed On:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <h3>🎯 What's Next?</h3>
              <ul>
                  <li>📧 You will receive event updates via email</li>
                  <li>📱 Follow our social media for announcements</li>
                  <li>🤝 Join our WhatsApp group (link will be shared soon)</li>
                  <li>📅 Mark your calendar for upcoming events</li>
                  <li>🎓 Prepare for an amazing entrepreneurial journey!</li>
              </ul>
              
              <div style="text-align: center;">
                  <a href="https://ecellsmec.com" class="cta-button">Visit Our Website</a>
              </div>
              
              <div class="footer">
                  <p>Best regards,<br>
                  <strong>Team E-Cell SMEC</strong></p>
                  <p>📧 ecell.smec@gmail.com | 🌐 ecellsmec.com</p>
                  <p><em>Entrepreneurship Cell | St. Martin's Engineering College</em></p>
                  <p style="margin-top: 15px; font-size: 12px; color: #888;">
                      This registration was confirmed by: ${admin_email}
                  </p>
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
        to: [registration.email],
        cc: ['ecell.smec@gmail.com'],
        subject: emailSubject,
        html: emailBody,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('Failed to send confirmation email:', error)
      return new Response(JSON.stringify({ error: 'Failed to send email, but payment was confirmed' }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const emailData = await res.json()
    console.log('Payment confirmation email sent successfully to:', registration.email)

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Payment confirmed and email sent',
      registration: {
        name: registration.name,
        email: registration.email,
        event_name: registration.event_name
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in admin-confirm-payment function:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})