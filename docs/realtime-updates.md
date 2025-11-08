# Real-time Updates with Supabase

This document explains how to implement real-time updates for the public list view using Supabase Realtime.

## Overview

Supabase Realtime uses PostgreSQL's replication feature to broadcast database changes via WebSockets. When someone claims a gift, all viewers of that list would see the update instantly without refreshing.

## Setup

### 1. Enable Replication in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Database** → **Replication**
3. Enable replication for the `items` table
4. (Optional) Enable for the `lists` table if you want real-time view count updates

### 2. Implementation

Update `/src/app/list/[token]/page.tsx` to subscribe to changes:

```typescript
useEffect(() => {
  loadList()

  // Only subscribe if we have a list ID and it's not the user's own list
  if (!list?.id || isOwnList) return

  // Subscribe to realtime changes on items for this list
  const channel = supabase
    .channel(`list-${list.id}-changes`)
    .on(
      'postgres_changes',
      {
        event: '*', // Listen to INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'items',
        filter: `list_id=eq.${list.id}`
      },
      (payload) => {
        console.log('Item change received:', payload)

        if (payload.eventType === 'INSERT') {
          // New item added
          setItems(prev => [...prev, payload.new as Item])
        } else if (payload.eventType === 'UPDATE') {
          // Item updated (claimed/unclaimed or edited)
          setItems(prev => prev.map(item =>
            item.id === payload.new.id ? payload.new as Item : item
          ))
        } else if (payload.eventType === 'DELETE') {
          // Item removed
          setItems(prev => prev.filter(item => item.id !== payload.old.id))
        }
      }
    )
    .subscribe()

  // Cleanup subscription on unmount
  return () => {
    supabase.removeChannel(channel)
  }
}, [list?.id, isOwnList])
```

### 3. Optional: Presence Indicators

You can also show how many people are currently viewing a list:

```typescript
const channel = supabase
  .channel(`list-${list.id}-presence`)
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState()
    const viewers = Object.keys(state).length
    setViewerCount(viewers)
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      // Track this viewer
      await channel.track({
        online_at: new Date().toISOString()
      })
    }
  })
```

## Benefits

- ✅ **Instant updates**: See claims as they happen in real-time
- ✅ **Multi-viewer support**: Multiple people can view simultaneously
- ✅ **No polling**: More efficient than checking for updates periodically
- ✅ **No race conditions**: Everyone sees the same state
- ✅ **Better UX**: Feels more responsive and modern

## Considerations

- **Bandwidth**: Each active connection uses some bandwidth (minimal for this use case)
- **Connection handling**: Need to handle reconnections if network drops
- **Graceful degradation**: App should still work if replication is disabled
- **Testing**: Need to test with multiple browsers/users simultaneously

## Error Handling

```typescript
const channel = supabase
  .channel(`list-${list.id}`)
  .on(/* ... */)
  .subscribe((status, err) => {
    if (status === 'SUBSCRIBED') {
      console.log('Connected to realtime updates')
    }
    if (status === 'CHANNEL_ERROR') {
      console.error('Realtime connection error:', err)
      // Could show a toast notification
    }
    if (status === 'TIMED_OUT') {
      console.warn('Realtime connection timed out')
      // Could attempt reconnection
    }
  })
```

## Resources

- [Supabase Realtime Documentation](https://supabase.com/docs/guides/realtime)
- [Realtime Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes)
- [Realtime Presence](https://supabase.com/docs/guides/realtime/presence)

## Estimated Implementation Time

- Basic real-time updates: **30-60 minutes**
- With presence indicators: **+30 minutes**
- Testing and polish: **+30 minutes**

**Total: 1-2 hours**
