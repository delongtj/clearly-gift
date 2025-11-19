import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { listId, eventType, itemId, itemName, metadata } = await request.json()
    
    console.log('[API] Received track-event request:', { listId, eventType, itemId, itemName })

    if (!listId || !eventType || !itemId || !itemName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('[API] Inserting into list_subscription_events with itemId:', itemId)
    const { error } = await supabase.from('list_subscription_events').insert({
      list_id: listId,
      event_type: eventType,
      item_id: itemId,
      item_name: itemName,
      metadata: metadata || null,
    })

    if (error) {
      console.error('[API] Error tracking subscription event:', error)
      console.error('[API] Service role key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
      console.error('[API] Payload:', { listId, eventType, itemId, itemName })
      return NextResponse.json(
        { error: 'Failed to track event', details: error },
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
