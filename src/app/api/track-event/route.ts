import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { listId, eventType, itemId, itemName, metadata } = await request.json()

    if (!listId || !eventType || !itemId || !itemName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { error } = await supabase.from('list_subscription_events').insert({
      list_id: listId,
      event_type: eventType,
      item_id: itemId,
      item_name: itemName,
      metadata: metadata || null,
    })

    if (error) {
      console.error('[API] Error tracking subscription event:', error)
      return NextResponse.json(
        { error: 'Failed to track event' },
        { status: 500 }
      )
    }

    console.log(`[API] Event tracked: ${eventType} for item ${itemId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
