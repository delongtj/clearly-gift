/**
 * Supabase Auth Email Template
 * 
 * Use this template for the Supabase auth "code" email template.
 * Only the body content is needed - paste this directly into Supabase's email template editor.
 * 
 * The code variable uses Supabase's syntax: {{ .Code }}
 * Expires in 15 minutes (standard OTP expiration).
 */

export const SUPABASE_AUTH_EMAIL_TEMPLATE = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
    
    <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 32px; text-align: center; color: white;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.01em;">clearly.gift</h1>
    </div>
    
    <div style="padding: 40px 32px;">
      <p style="font-size: 16px; color: #374151; margin: 0 0 32px 0;">Your sign in code is below. This code will expire in 15 minutes.</p>
      
      <div style="background-color: #f3f4f6; border: 2px solid #059669; border-radius: 8px; padding: 24px; text-align: center; margin: 32px 0;">
        <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 12px;">One-time sign in code</div>
        <div style="font-family: monospace; font-size: 32px; font-weight: 700; color: #059669; letter-spacing: 4px;">{{ .Code }}</div>
      </div>
      
      <p style="font-size: 14px; color: #6b7280; text-align: center; margin: 24px 0 0 0; padding-top: 24px; border-top: 1px solid #e5e7eb;">If you didn't request this code, you can safely ignore this email.</p>
    </div>
    
    <div style="background-color: #f9fafb; padding: 24px 32px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280;">
      <p style="margin: 0;">© clearly.gift — Share your wishlist. Keep the surprise.</p>
    </div>
  </div>
</div>`;
