# List Subscriptions Setup Guide

## Prerequisites

- Resend account (https://resend.com) - for sending emails
- Upstash account (https://upstash.com) - for scheduling the batch job
- Supabase project already set up

## Step 1: Database Setup

Run the migration to create the necessary tables:

```bash
supabase migration up 20251112000000_add_list_subscriptions
```

Or manually execute the SQL in `supabase/migrations/20251112000000_add_list_subscriptions.sql` in your Supabase dashboard.

## Step 2: Install Dependencies

```bash
npm install resend
```

## Step 3: Configure Resend

1. Sign up for Resend at https://resend.com
2. Get your API key from the dashboard
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```
4. Verify the sender email domain in Resend (or use their test domain during development)

## Step 4: Set up Upstash for Scheduling

Upstash provides free serverless Redis and scheduled tasks. This will trigger the batch notification job every 30 minutes.

### Option A: Using Upstash Scheduled Tasks (Recommended)

1. Sign up for Upstash at https://upstash.com
2. Create a new Redis database (free tier available)
3. Generate a strong secret token. You can use:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
4. Add the secret to your environment:
   - In `.env.local`:
     ```
     BATCH_JOB_SECRET=your-generated-secret-here
     ```
   - In Netlify dashboard:
     ```
     BATCH_JOB_SECRET=your-generated-secret-here
     ```
5. Go to Upstash QStash and create a new scheduled task:
   - **Destination**: `https://your-domain.netlify.app/.netlify/functions/batch-send-notifications`
   - **Schedule**: `*/30 * * * *` (every 30 minutes)
   - **Method**: POST
   - Headers:
     ```
     Authorization: Bearer your-generated-secret-here
     ```

### Option B: Using External Cron Service

Alternatively, use a free external cron service:

1. Create a simple endpoint guard in your function
2. Use EasyCron (https://www.easycron.com) or similar service
3. Set it to ping your function every 30 minutes

## Step 5: Configure Netlify Environment Variables

In your Netlify dashboard (or via CLI):

```bash
netlify env:set SUPABASE_SERVICE_ROLE_KEY "your-key"
netlify env:set RESEND_API_KEY "your-key"
netlify env:set BATCH_JOB_SECRET "your-generated-secret"
netlify env:set NEXT_PUBLIC_APP_URL "https://your-domain.com"
netlify env:set NEXT_PUBLIC_SUPABASE_URL "your-supabase-url"
```

## Step 6: Configure Upstash (if using scheduled tasks)

In `.env.local` and Netlify:

```
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

## Step 7: Frontend Setup

The subscription UI component needs to be added to the public list page. Here's a basic example:

```tsx
// In your public list page component
'use client'

import { useState } from 'react'

export function SubscribeToList({ listId, listName }: { listId: string; listName: string }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ list_id: listId, email })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('✓ Check your email to verify!')
        setEmail('')
      } else {
        setMessage(data.error || 'Something went wrong')
      }
    } catch (error) {
      setMessage('Error subscribing. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Subscribing...' : 'Subscribe to Updates'}
      </button>
      {message && <p>{message}</p>}
    </form>
  )
}
```

## Step 8: Create Success/Error Pages

Create these pages for the verification and unsubscribe flows:

### `/app/verify-subscription-success/page.tsx`
```tsx
export default function VerifySuccess() {
  return (
    <div className="container mx-auto py-12">
      <h1>Email Verified!</h1>
      <p>You'll start receiving updates about your wishlist.</p>
      <a href="/">Back to home</a>
    </div>
  )
}
```

### `/app/verify-subscription-error/page.tsx`
```tsx
export default function VerifyError() {
  return (
    <div className="container mx-auto py-12">
      <h1>Verification Failed</h1>
      <p>The verification link may have expired. Try subscribing again.</p>
      <a href="/">Back to home</a>
    </div>
  )
}
```

### `/app/unsubscribe-success/page.tsx`
```tsx
export default function UnsubscribeSuccess() {
  return (
    <div className="container mx-auto py-12">
      <h1>Unsubscribed</h1>
      <p>You won't receive any more updates.</p>
      <a href="/">Back to home</a>
    </div>
  )
}
```

### `/app/unsubscribe-error/page.tsx`
```tsx
export default function UnsubscribeError() {
  return (
    <div className="container mx-auto py-12">
      <h1>Error</h1>
      <p>There was an error unsubscribing. Please try again later.</p>
      <a href="/">Back to home</a>
    </div>
  )
}
```

## Step 9: Testing

1. Subscribe to a list with your email
2. Verify the subscription via the email link
3. Make changes to items (add, claim, etc.)
4. Wait up to 30 minutes or manually trigger the batch job with your secret:
   ```bash
   curl -X POST https://your-domain.netlify.app/.netlify/functions/batch-send-notifications \
     -H "Authorization: Bearer your-generated-secret"
   ```
5. Check your email for the notification

## Troubleshooting

### No emails being sent
- Check that `RESEND_API_KEY` is set correctly
- Check Netlify function logs for errors
- Verify the sender email is configured in Resend

### Function not running
- Check that the Upstash scheduled task is set up correctly
- Verify the function URL is accessible
- Check Netlify function logs

### Database errors
- Make sure the migration ran successfully
- Verify service role key has proper permissions
- Check Supabase RLS policies

## Cost

- **Resend**: Free tier includes 100 emails/day (paid plan $20/month for unlimited)
- **Upstash**: Free tier includes 100 messages/day in Redis (paid plans available)
- **Netlify**: Free tier includes 125,000 function invocations/month

For a typical wishlist app, you'll stay well within free tier limits.
