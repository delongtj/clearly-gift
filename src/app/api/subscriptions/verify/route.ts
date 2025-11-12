import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// PUT /api/subscriptions/verify - Verify subscription email
export async function PUT(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Missing verification token' },
        { status: 400 }
      )
    }

    // Find subscription with valid token
    const { data: subscription } = await supabase
      .from('list_subscriptions')
      .select('id')
      .eq('verification_token', token)
      .is('verified_at', null)
      .single()

    if (!subscription) {
      return NextResponse.json(
        { error: 'Invalid or expired verification link' },
        { status: 404 }
      )
    }

    // Check if token is expired
    const { data: withExpiry } = await supabase
      .from('list_subscriptions')
      .select('verification_expires_at')
      .eq('id', subscription.id)
      .single()

    if (withExpiry?.verification_expires_at && 
        new Date(withExpiry.verification_expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Verification link expired' },
        { status: 410 }
      )
    }

    // Mark as verified
    const { error } = await supabase
      .from('list_subscriptions')
      .update({
        verified_at: new Date().toISOString(),
        verification_token: null // Clear token after use
      })
      .eq('id', subscription.id)

    if (error) {
      console.error('Error verifying subscription:', error)
      return NextResponse.json(
        { error: 'Failed to verify subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified! You\'ll start receiving updates.'
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Also support GET for email links
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Missing verification token' },
        { status: 400 }
      )
    }

    // Find subscription with valid token
    const { data: subscription } = await supabase
      .from('list_subscriptions')
      .select('id, verification_expires_at')
      .eq('verification_token', token)
      .is('verified_at', null)
      .single()

    if (!subscription) {
      return NextResponse.json(
        { error: 'Invalid or expired verification link' },
        { status: 404 }
      )
    }

    // Check if token is expired
    if (subscription.verification_expires_at && 
        new Date(subscription.verification_expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Verification link expired' },
        { status: 410 }
      )
    }

    // Mark as verified
    const { error } = await supabase
      .from('list_subscriptions')
      .update({
        verified_at: new Date().toISOString(),
        verification_token: null
      })
      .eq('id', subscription.id)

    if (error) {
      console.error('Error verifying subscription:', error)
      return NextResponse.redirect(new URL('/verify-subscription-error', request.url))
    }

    return NextResponse.redirect(new URL('/verify-subscription-success', request.url))
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.redirect(new URL('/verify-subscription-error', request.url))
  }
}
