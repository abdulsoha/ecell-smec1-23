import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

interface SubscriptionWelcomeData {
  name: string
  email: string
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
    const { name, email, timestamp }: SubscriptionWelcomeData = await req.json()

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set')
      return new Response(JSON.stringify({ error: 'Email service not configured' }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const emailSubject = `🎉 Welcome to E-Cell SMEC Community, ${name}!`
    
    const emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to E-Cell SMEC</title>
          <style>
              body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 15px 15px 0 0; }
              .content { background: #f8f9fa; padding: 30px 20px; border-radius: 0 0 15px 15px; }
              .welcome-badge { display: inline-block; padding: 10px 20px; border-radius: 25px; font-weight: bold; margin: 15px 0; background: #d4edda; color: #155724; }
              .highlights { background: white; padding: 25px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #667eea; }
              .feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
              .feature-item { background: white; padding: 15px; border-radius: 8px; text-align: center; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
              .cta-button { background: #667eea; color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: bold; }
              .social-links { margin: 20px 0; }
              .social-links a { display: inline-block; margin: 0 10px; padding: 8px 15px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; }
          </style>
      </head>
      <body>
          <div class="header">
              <h1>🚀 Welcome to E-Cell SMEC!</h1>
              <p style="font-size: 18px; margin: 0;">Your Entrepreneurial Journey Starts Here</p>
          </div>
          
          <div class="content">
              <div class="welcome-badge">🎉 Welcome aboard, ${name}!</div>
              
              <p>Thank you for subscribing to <strong>E-Cell SMEC</strong> updates! You've just joined a vibrant community of aspiring entrepreneurs, innovators, and change-makers at St. Martin's Engineering College.</p>
              
              <div class="highlights">
                  <h3>🌟 What You Can Expect:</h3>
                  <ul style="padding-left: 20px;">
                      <li><strong>🎪 Event Notifications:</strong> Be the first to know about workshops, startup competitions, and guest lectures</li>
                      <li><strong>💡 Startup Insights:</strong> Weekly tips, trends, and success stories from the startup world</li>
                      <li><strong>🤝 Networking Opportunities:</strong> Connect with like-minded peers and industry mentors</li>
                      <li><strong>🎓 Learning Resources:</strong> Access to exclusive content, guides, and entrepreneurship materials</li>
                      <li><strong>🏆 Competition Updates:</strong> Early access to pitch competitions and startup challenges</li>
                  </ul>
              </div>

              <div class="feature-grid">
                  <div class="feature-item">
                      <h4>📅 Monthly Events</h4>
                      <p>Workshops, seminars, and startup meetups</p>
                  </div>
                  <div class="feature-item">
                      <h4>🎯 Mentorship</h4>
                      <p>Guidance from successful entrepreneurs</p>
                  </div>
                  <div class="feature-item">
                      <h4>💰 Funding Support</h4>
                      <p>Help with pitch decks and investor connections</p>
                  </div>
                  <div class="feature-item">
                      <h4>🏗️ Incubation</h4>
                      <p>Resources to turn ideas into reality</p>
                  </div>
              </div>

              <div style="text-align: center;">
                  <a href="https://ecellsmec.com" class="cta-button">🌐 Explore Our Website</a>
              </div>

              <div class="highlights">
                  <h3>🚀 Ready to Get Started?</h3>
                  <p><strong>Follow us on social media</strong> to stay connected and never miss an update:</p>
                  <div class="social-links" style="text-align: center;">
                      <a href="#" style="background: #1877f2;">📘 Facebook</a>
                      <a href="#" style="background: #1da1f2;">🐦 Twitter</a>
                      <a href="#" style="background: #e1306c;">📷 Instagram</a>
                      <a href="#" style="background: #0077b5;">💼 LinkedIn</a>
                  </div>
              </div>

              <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
                  <h4 style="color: #856404; margin: 0 0 10px 0;">💡 Pro Tip for Aspiring Entrepreneurs:</h4>
                  <p style="color: #856404; margin: 0;">"Start before you're ready. The best time to plant a tree was 20 years ago. The second-best time is now. Your entrepreneurial journey begins with a single step!"</p>
              </div>
              
              <div class="footer">
                  <p>🙏 Thank you for joining our community!<br>
                  <strong>Team E-Cell SMEC</strong></p>
                  <p>📧 ecell.smec@gmail.com | 🌐 ecellsmec.com</p>
                  <p><em>Entrepreneurship Cell | St. Martin's Engineering College</em></p>
                  <p style="margin-top: 20px; font-size: 12px; color: #888;">
                      Subscribed on: ${new Date(timestamp).toLocaleString()}<br>
                      Don't want these emails? <a href="#" style="color: #667eea;">Unsubscribe here</a>
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
        to: [email],
        bcc: ['ecell.smec@gmail.com'], // BCC admin for tracking
        subject: emailSubject,
        html: emailBody,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('Failed to send welcome email:', error)
      return new Response(JSON.stringify({ error: 'Failed to send welcome email' }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const data = await res.json()
    console.log('Welcome email sent successfully to:', email)

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in send-subscription-welcome function:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})