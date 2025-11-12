# List Subscriptions Implementation Summary

This document outlines the complete implementation of the list subscription feature for Clearly.gift.

## What Was Built

Users can now subscribe to lists with their email address and receive batched email notifications (every 30 minutes) when:
- Items are added to the list
- Items are claimed or unclaimed
- Items are removed from the list

## Files Created

### Database Migrations
- `supabase/migrations/20251112000000_add_list_subscriptions.sql` - Creates three new tables:
  - `list_subscriptions` - Tracks email subscriptions with verification tokens
  - `list_subscription_events` - Records all changes to items in lists
  - `list_subscription_batches` - Tracks which events have been sent to which subscribers

### API Routes
- `src/app/api/subscriptions/route.ts` - POST endpoint to subscribe with email
- `src/app/api/subscriptions/verify/route.ts` - PUT/GET endpoint to verify email (24hr token validity)
- `src/app/api/subscriptions/unsubscribe/route.ts` - DELETE/GET endpoint to unsubscribe (one-click via email)

### Backend Services
- `src/lib/subscriptions.ts` - Helper functions to track subscription events (item_added, item_removed, item_claimed, item_unclaimed)
- `src/lib/database.ts` - Updated to call subscription tracking when items are modified

### Scheduled Job
- `netlify/functions/batch-send-notifications.ts` - Runs every 30 minutes to:
  - Find all verified subscriptions with pending events
  - Group events by type
  - Render HTML emails with summaries
  - Send via Resend
  - Track sent batches to avoid duplicates

### Configuration
- `netlify.toml` - Netlify build configuration for functions
- `package.json` - Added `resend` dependency for email sending

### Documentation
- `docs/list-subscriptions.md` - Complete technical architecture and schema
- `docs/list-subscriptions-setup.md` - Step-by-step setup guide with Resend & Upstash integration

## Architecture Overview

### Subscription Flow
1. User enters email on public list page → POST `/api/subscriptions`
2. System generates verification token (expires in 24 hours) and unsubscribe token
3. Verification email sent via Resend with clickable verification link
4. User clicks link → PUT/GET `/api/subscriptions/verify?token=...`
5. Subscription marked as verified and starts receiving notifications

### Event Tracking Flow
1. When item is created/modified/claimed/unclaimed, event is recorded in `list_subscription_events`
2. Events include: `item_added`, `item_removed`, `item_claimed`, `item_unclaimed`
3. Metadata captured (e.g., who claimed an item)

### Notification Batching Flow
1. Netlify function triggers every 30 minutes via Upstash scheduled tasks
2. For each verified subscription, query events since last batch
3. Group events by type (added, claimed, removed, unclaimed)
4. Render HTML email with summary of changes
5. Send email via Resend with unsubscribe link
6. Create batch record to track what was sent

## Key Design Decisions

### One-Click Verification & Unsubscription
- Verification link is a simple token lookup (no authentication required)
- Unsubscribe link does the same - just delete the subscription record
- Prevents spam: tokens are unique and expire after 24 hours (verification)

### Batching Every 30 Minutes
- Prevents email fatigue if items change frequently
- Consolidates multiple events into one email
- Configurable interval in Upstash cron expression

### Anonymous Subscriptions
- No user account required
- Email is the only identifier
- Matches the app's philosophy of frictionless sharing
- Prevents one email from subscribing twice to same list (unique constraint)

### Event Denormalization
- `item_name` stored with event in case item is deleted later
- Emails still make sense even after item is removed from list
- `item_id` becomes NULL when item deleted, but event preserved

### Service Role Key for Events
- Events created via service role (from API/Netlify) - bypasses RLS
- Maintains full event history regardless of item status

## Setup Requirements

1. **Resend API Key** - For sending emails
   - Free tier: 100 emails/day
   - Paid: $20/month for unlimited

2. **Upstash Account** - For scheduling the batch job
   - Free tier: 100 messages/day
   - Scheduled tasks trigger the Netlify function every 30 minutes

3. **Netlify Functions** - Already included in free tier
   - 125,000 invocations/month free

4. **Environment Variables** (add to `.env.local` and Netlify):
   ```
   RESEND_API_KEY=re_xxxxx
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   SUPABASE_SERVICE_ROLE_KEY=xxx
   ```

## Frontend Integration

You still need to add the subscription UI to your public list page. The API endpoints are ready:

**Subscribe button/form example:**
```tsx
<form onSubmit={async (e) => {
  e.preventDefault()
  await fetch('/api/subscriptions', {
    method: 'POST',
    body: JSON.stringify({ list_id: listId, email })
  })
}}>
  <input type="email" placeholder="your@email.com" />
  <button>Subscribe to Updates</button>
</form>
```

You'll also want to create these pages (redirected to after email verification/unsubscribe):
- `/verify-subscription-success`
- `/verify-subscription-error`
- `/unsubscribe-success`
- `/unsubscribe-error`

## Next Steps

1. Run the database migration
2. Install dependencies: `npm install`
3. Set up Resend account and add API key to `.env.local`
4. Set up Upstash account and configure scheduled task
5. Deploy to Netlify
6. Add subscription UI component to public list page
7. Create success/error pages
8. Test the flow

## Costs at Scale

- **1,000 active subscribers with daily changes**: ~1,000 emails/month = well within free tier
- **10,000 active subscribers**: ~10,000 emails/month = still free tier
- **50,000 active subscribers**: ~50,000 emails/month = exceeds free (but only if highly active)

For most gift list scenarios, you'll stay on free tier indefinitely.
