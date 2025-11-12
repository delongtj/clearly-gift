# List Subscriptions Feature Architecture

## Overview
Users can subscribe to lists with their email to receive batched notifications (every 30 minutes) when items are added, removed, or claimed.

## Database Schema

### `list_subscriptions` table
```sql
CREATE TABLE public.list_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID REFERENCES public.lists(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  verification_token TEXT NOT NULL,
  verification_expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  unsubscribe_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_list_subscriptions_list_id ON public.list_subscriptions(list_id);
CREATE INDEX idx_list_subscriptions_email ON public.list_subscriptions(email);
CREATE INDEX idx_list_subscriptions_verification_token ON public.list_subscriptions(verification_token);
CREATE INDEX idx_list_subscriptions_unsubscribe_token ON public.list_subscriptions(unsubscribe_token);

-- Ensure one verified subscription per email per list
CREATE UNIQUE INDEX idx_list_subscriptions_verified_unique 
  ON public.list_subscriptions(list_id, email) 
  WHERE verified_at IS NOT NULL;
```

### `list_subscription_events` table
```sql
CREATE TABLE public.list_subscription_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID REFERENCES public.lists(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL, -- 'item_added', 'item_removed', 'item_claimed', 'item_unclaimed'
  item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL, -- Denormalized in case item is deleted
  metadata JSONB, -- Extra context: claimed_by, previous_state, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_list_subscription_events_list_id ON public.list_subscription_events(list_id);
CREATE INDEX idx_list_subscription_events_created_at ON public.list_subscription_events(created_at);
```

### `list_subscription_batches` table
```sql
CREATE TABLE public.list_subscription_batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_subscription_id UUID REFERENCES public.list_subscriptions(id) ON DELETE CASCADE NOT NULL,
  sent_at TIMESTAMPTZ,
  last_event_at TIMESTAMPTZ NOT NULL, -- Latest event timestamp in this batch
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_list_subscription_batches_sent_at ON public.list_subscription_batches(sent_at);
```

## Workflow

### 1. Subscription Flow
1. User enters email on public list page
2. POST to `/api/subscriptions` with `{list_id, email}`
3. Generate verification token (random) + unsubscribe token (random)
4. Store subscription record (unverified)
5. Send verification email via Resend with link: `/verify-subscription?token=<verification_token>`
6. Show "Check your email" message
7. User clicks verification link → PUT `/api/subscriptions/verify?token=<verification_token>`
8. Mark subscription as verified (set `verified_at`)

### 2. Event Tracking
When items are modified, trigger event creation:
- **Item created**: Create `item_added` event
- **Item deleted**: Create `item_removed` event  
- **Item claimed**: Create `item_claimed` event with metadata `{claimed_by}`
- **Item unclaimed**: Create `item_unclaimed` event

This happens in the same mutation that modifies the item.

### 3. Batch Notification Job (Every 30 minutes)
Netlify Function triggered via Upstash:

1. Find all verified subscriptions from the last 30 minutes that have pending events
2. For each subscription:
   - Query events since the last batch
   - Group events by type
   - Render email template with event summary
   - Send via Resend
   - Create batch record with `sent_at` timestamp
3. If no events exist for a subscription in the 30-minute window, skip it

### 4. Unsubscribe Flow
1. User clicks unsubscribe link in email: `/unsubscribe?token=<unsubscribe_token>`
2. GET/POST to `/api/subscriptions/unsubscribe?token=<unsubscribe_token>`
3. Delete subscription record by unsubscribe token
4. Show confirmation message

## API Endpoints

### POST `/api/subscriptions`
Subscribe to a list.
```json
Request: {
  "list_id": "uuid",
  "email": "user@example.com"
}

Response: {
  "success": true,
  "message": "Verification email sent"
}
```

### PUT `/api/subscriptions/verify`
Verify subscription email.
```json
Request: {
  "token": "verification_token"
}

Response: {
  "success": true,
  "message": "Email verified"
}
```

### DELETE `/api/subscriptions/unsubscribe`
Unsubscribe from a list.
```json
Request: {
  "token": "unsubscribe_token"
}

Response: {
  "success": true,
  "message": "Unsubscribed"
}
```

## Netlify Functions

### `batch-send-notifications` (Triggered every 30 minutes via Upstash)
- Query `list_subscription_batches` for last entry per subscription
- Find events created after last batch
- Render and send emails
- Create new batch records

## Email Template

Subject: `[List Name] - Updates on your wishlist`

Body:
```
Hi,

Here's what changed on [List Name] in the last 30 minutes:

📝 New items (X):
- Item 1
- Item 2

✅ Items claimed (X):
- Item 1 (claimed by: John)
- Item 2

🗑️ Removed items (X):
- Item 1
- Item 2

View the full list: [link]

---
To stop receiving these notifications: [unsubscribe link]
```

## Environment Variables
```
RESEND_API_KEY=<key>
UPSTASH_REDIS_REST_URL=<url>
UPSTASH_REDIS_REST_TOKEN=<token>
```

## Notes
- Verification tokens expire after 24 hours
- Unverified subscriptions are garbage collected (optional, can manually delete)
- Deleted lists automatically cascade-delete subscriptions
- Deleted items don't break events (item_id becomes null, but item_name is preserved)
