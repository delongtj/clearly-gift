# Real-time Updates Setup Guide

The real-time updates feature is now implemented. Follow these steps to enable it in your Supabase project.

## Enable Replication for the `items` Table

1. Go to your [Supabase project dashboard](https://supabase.com/dashboard)
2. Navigate to **Database** → **Replication**
3. Under the "Replication" section, find the `items` table
4. Toggle it ON to enable replication

This allows Supabase to broadcast database changes to all connected clients via WebSockets.

## (Optional) Enable Replication for the `lists` Table

If you want real-time view count updates (when the list is viewed by multiple people):

1. In the same Replication section
2. Find the `lists` table
3. Toggle it ON

## How It Works

Once replication is enabled:

- When someone claims a gift, all viewers of that list see the update instantly
- When someone unclaims a gift, the change propagates in real-time
- When items are added/deleted, viewers see those changes immediately
- No page refresh needed

## Implementation Details

The implementation is in `/src/app/list/[token]/PublicListClient.tsx`:

- **INSERT events**: New items are added to the items list
- **UPDATE events**: Item claims/unclaims are reflected immediately
- **DELETE events**: Removed items disappear from the list
- **Error handling**: Gracefully logs connection errors and timeouts
- **No polling**: More efficient than checking for updates periodically

## Testing

To test the real-time updates:

1. Open the same list in two different browser windows/tabs
2. Claim a gift in one window
3. You should see the update instantly in the other window without refreshing

## Notes

- Real-time updates only work for viewers of the public list
- List owners cannot view their own lists to prevent seeing claim information
- Minimal bandwidth usage - only changes are sent over WebSockets
- Automatic cleanup when users navigate away from the page
