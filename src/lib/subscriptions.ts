import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type EventType = 'item_added' | 'item_removed' | 'item_claimed' | 'item_unclaimed'

/**
 * Track a subscription event in the database
 * This is called whenever an item changes in a list
 */
export async function trackSubscriptionEvent(
  listId: string,
  eventType: EventType,
  itemId: string,
  itemName: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await supabase.from('list_subscription_events').insert({
      list_id: listId,
      event_type: eventType,
      item_id: itemId,
      item_name: itemName,
      metadata: metadata || null,
      created_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error tracking subscription event:', error)
    // Don't throw - this shouldn't block the main operation
  }
}

/**
 * Track when an item is added to a list
 */
export async function trackItemAdded(
  listId: string,
  itemId: string,
  itemName: string
): Promise<void> {
  await trackSubscriptionEvent(listId, 'item_added', itemId, itemName)
}

/**
 * Track when an item is removed from a list
 */
export async function trackItemRemoved(
  listId: string,
  itemId: string,
  itemName: string
): Promise<void> {
  await trackSubscriptionEvent(listId, 'item_removed', itemId, itemName)
}

/**
 * Track when an item is claimed
 */
export async function trackItemClaimed(
  listId: string,
  itemId: string,
  itemName: string,
  claimedBy: string
): Promise<void> {
  await trackSubscriptionEvent(listId, 'item_claimed', itemId, itemName, {
    claimed_by: claimedBy
  })
}

/**
 * Track when an item is unclaimed
 */
export async function trackItemUnclaimed(
  listId: string,
  itemId: string,
  itemName: string
): Promise<void> {
  await trackSubscriptionEvent(listId, 'item_unclaimed', itemId, itemName)
}
