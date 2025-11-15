import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set')
  }
  return new Resend(apiKey)
}

function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15)
}

// POST /api/subscriptions - Subscribe to a list
export async function POST(request: NextRequest) {
  try {
    const { list_id, email } = await request.json()

    if (!list_id || !email) {
      return NextResponse.json(
        { error: 'Missing list_id or email' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if list exists
    const { data: list } = await supabase
      .from('lists')
      .select('id, name')
      .eq('id', list_id)
      .single()

    if (!list) {
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      )
    }

    // Check if email already has a verified subscription
    const { data: existing } = await supabase
      .from('list_subscriptions')
      .select('id')
      .eq('list_id', list_id)
      .eq('email', email)
      .eq('verified_at', null)
      .single()

    if (existing) {
      // Resend verification email
      const { data: unverified } = await supabase
        .from('list_subscriptions')
        .select('verification_token')
        .eq('list_id', list_id)
        .eq('email', email)
        .is('verified_at', null)
        .single()

      if (unverified) {
        await sendVerificationEmail(email, list.name, unverified.verification_token)
        return NextResponse.json({
          success: true,
          message: 'Verification email sent. Check your inbox!'
        })
      }
    }

    // Create new subscription
    const verification_token = generateToken()
    const unsubscribe_token = generateToken()
    const verification_expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    const { data: subscription, error } = await supabase
      .from('list_subscriptions')
      .insert({
        list_id,
        email,
        verification_token,
        unsubscribe_token,
        verification_expires_at
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating subscription:', error)
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      )
    }

    // Send verification email
    await sendVerificationEmail(email, list.name, verification_token)

    return NextResponse.json({
      success: true,
      message: 'Verification email sent. Check your inbox!'
    })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function sendVerificationEmail(email: string, listName: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-subscription?token=${token}`

  const resend = getResend()
  await resend.emails.send({
    from: 'clearly.gift <noreply@clearly.gift>',
    to: email,
    subject: `Verify your subscription to ${listName}`,
    html: `
      <p>Hi there,</p>
      <p>You're one step away from getting updates about <strong>${listName}</strong>.</p>
      <p><a href="${verifyUrl}" style="background-color: #069668; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Your Email</a></p>
      <p>Or copy this link: ${verifyUrl}</p>
      <p>This link expires in 24 hours.</p>
      <p>clearly.gift</p>
    `
  })
}
