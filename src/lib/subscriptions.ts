export type EventType = 'item_added' | 'item_removed' | 'item_claimed' | 'item_unclaimed'

/**
 * Track a subscription event in the database
 * This is called whenever an item changes in a list
 * Calls server-side API to avoid exposing service role key
 */
export async function trackSubscriptionEvent(
  listId: string,
  eventType: EventType,
  itemId: string,
  itemName: string,
  metadata?: Record<string, any>
): Promise<void> {
  console.log(`[SUBSCRIPTION] Tracking event: ${eventType} for item ${itemId}`)
  try {
    const response = await fetch('/api/track-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listId,
        eventType,
        itemId,
        itemName,
        metadata
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      console.error('[SUBSCRIPTION] API error:', error)
      return
    }
    
    console.log(`[SUBSCRIPTION] Event tracked successfully`)
  } catch (error) {
    console.error('[SUBSCRIPTION] Error tracking subscription event:', error)
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
