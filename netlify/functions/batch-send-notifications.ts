import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

interface SubscriptionEvent {
  id: string
  event_type: 'item_added' | 'item_removed' | 'item_claimed' | 'item_unclaimed'
  item_name: string
  metadata?: Record<string, any>
  created_at: string
}

interface EventSummary {
  item_added: Array<{ item_name: string }>
  item_removed: Array<{ item_name: string }>
  item_claimed: Array<{ item_name: string; claimed_by?: string }>
  item_unclaimed: Array<{ item_name: string }>
}

// Email template function
function generateNotificationEmail(
  listName: string,
  summary: EventSummary,
  listUrl: string,
  unsubscribeUrl: string
): string {
  const totalChanges =
    summary.item_added.length +
    summary.item_removed.length +
    summary.item_claimed.length +
    summary.item_unclaimed.length

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>List Updates: ${escapeHtml(listName)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #069668 0%, #047857 100%);
      padding: 40px 32px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      margin: 8px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 32px;
    }
    .summary {
      background-color: #f3f4f6;
      border-left: 4px solid #069668;
      padding: 16px;
      margin-bottom: 32px;
      border-radius: 4px;
    }
    .summary p {
      margin: 0;
      font-size: 14px;
      color: #4b5563;
    }
    .summary strong {
      color: #069668;
      font-weight: 600;
    }
    .section {
      margin-bottom: 28px;
    }
    .section-title {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    .section-icon {
      margin-right: 8px;
      font-size: 18px;
    }
    .item-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .item-list li {
      padding: 8px 0;
      color: #374151;
      font-size: 14px;
      display: flex;
      align-items: flex-start;
    }
    .item-list li:before {
      content: "→";
      display: inline-block;
      margin-right: 8px;
      color: #069668;
      font-weight: 600;
      min-width: 16px;
    }
    .item-claimed {
      color: #7c3aed;
    }
    .item-claimed:before {
      color: #7c3aed;
      content: "✓";
    }
    .item-removed {
      color: #9ca3af;
      text-decoration: line-through;
    }
    .item-removed:before {
      color: #d1d5db;
      content: "✕";
    }
    .claimed-by {
      font-size: 12px;
      color: #6b7280;
      margin-left: 8px;
      font-style: italic;
    }
    .cta-button {
      display: inline-block;
      background-color: #069668;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      margin: 24px 0;
      transition: background-color 0.2s;
    }
    .cta-button:hover {
      background-color: #047857;
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px 32px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
    .footer a {
      color: #069668;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .footer p {
      margin: 0 0 8px 0;
    }
    .footer p:last-child {
      margin-bottom: 0;
    }
    @media (max-width: 600px) {
      .container {
        border-radius: 0;
      }
      .content {
        padding: 24px;
      }
      .header {
        padding: 32px 24px;
      }
      .header h1 {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${escapeHtml(listName)}</h1>
      <p>Your wishlist has been updated</p>
    </div>
    <div class="content">
      <div class="summary">
        <p><strong>${totalChanges} change${totalChanges === 1 ? '' : 's'}</strong> in the last 30 minutes</p>
      </div>
      ${
        summary.item_added.length > 0
          ? `
        <div class="section">
          <div class="section-title">
            <span class="section-icon">📝</span>
            New items (${summary.item_added.length})
          </div>
          <ul class="item-list">
            ${summary.item_added.map(item => `<li>${escapeHtml(item.item_name)}</li>`).join('')}
          </ul>
        </div>
      `
          : ''
      }
      ${
        summary.item_claimed.length > 0
          ? `
        <div class="section">
          <div class="section-title">
            <span class="section-icon">✅</span>
            Items claimed (${summary.item_claimed.length})
          </div>
          <ul class="item-list">
            ${summary.item_claimed
              .map(
                item =>
                  `<li class="item-claimed">
                ${escapeHtml(item.item_name)}
                ${item.claimed_by ? `<span class="claimed-by">by ${escapeHtml(item.claimed_by)}</span>` : ''}
              </li>`
              )
              .join('')}
          </ul>
        </div>
      `
          : ''
      }
      ${
        summary.item_unclaimed.length > 0
          ? `
        <div class="section">
          <div class="section-title">
            <span class="section-icon">↩️</span>
            Items unclaimed (${summary.item_unclaimed.length})
          </div>
          <ul class="item-list">
            ${summary.item_unclaimed.map(item => `<li>${escapeHtml(item.item_name)}</li>`).join('')}
          </ul>
        </div>
      `
          : ''
      }
      ${
        summary.item_removed.length > 0
          ? `
        <div class="section">
          <div class="section-title">
            <span class="section-icon">🗑️</span>
            Removed items (${summary.item_removed.length})
          </div>
          <ul class="item-list">
            ${summary.item_removed.map(item => `<li class="item-removed">${escapeHtml(item.item_name)}</li>`).join('')}
          </ul>
        </div>
      `
          : ''
      }
      <div style="text-align: center;">
        <a href="${listUrl}" class="cta-button">View the full list</a>
      </div>
    </div>
    <div class="footer">
      <p>You're receiving this email because you subscribed to updates for this wishlist.</p>
      <p><a href="${unsubscribeUrl}">Unsubscribe from these notifications</a></p>
    </div>
  </div>
</body>
</html>`
}

export default async (req: any, context: any) => {
  // Simple authentication check
  const authHeader = req.headers['authorization'] || ''
  const expectedToken = process.env.BATCH_JOB_SECRET

  if (!expectedToken) {
    console.error('BATCH_JOB_SECRET not configured')
    return { statusCode: 500, body: 'Server misconfiguration' }
  }

  const [scheme, token] = authHeader.split(' ')
  if (scheme !== 'Bearer' || token !== expectedToken) {
    console.warn('Unauthorized batch job request')
    return { statusCode: 401, body: 'Unauthorized' }
  }

  console.log('Starting batch notification job...')

  try {
    // Get all verified subscriptions
    const { data: subscriptions, error: subsError } = await supabase
      .from('list_subscriptions')
      .select('id, list_id, email, unsubscribe_token')
      .not('verified_at', 'is', null)

    if (subsError) {
      console.error('Error fetching subscriptions:', subsError)
      return { statusCode: 500, body: 'Failed to fetch subscriptions' }
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No verified subscriptions found')
      return { statusCode: 200, body: 'No subscriptions to process' }
    }

    let emailsSent = 0
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()

    for (const subscription of subscriptions) {
      // Get the last batch sent time for this subscription
      const { data: lastBatch } = await supabase
        .from('list_subscription_batches')
        .select('last_event_at')
        .eq('list_subscription_id', subscription.id)
        .eq('sent_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      const sinceTime = lastBatch?.last_event_at || thirtyMinutesAgo

      // Get events for this subscription since last batch
      const { data: events, error: eventsError } = await supabase
        .from('list_subscription_events')
        .select('*')
        .eq('list_id', subscription.list_id)
        .gte('created_at', sinceTime)
        .order('created_at', { ascending: true })

      if (eventsError) {
        console.error(`Error fetching events for subscription ${subscription.id}:`, eventsError)
        continue
      }

      if (!events || events.length === 0) {
        console.log(`No new events for subscription ${subscription.id}`)
        continue
      }

      // Get list info for email
      const { data: list } = await supabase
        .from('lists')
        .select('id, name')
        .eq('id', subscription.list_id)
        .single()

      if (!list) continue

      // Group events by type
      const summary = groupEventsByType(events)

      // Send email
      const sent = await sendNotificationEmail(
        subscription.email,
        list.name,
        subscription.list_id,
        summary,
        subscription.unsubscribe_token
      )

      if (sent) {
        emailsSent++

        // Create batch record
        const latestEventTime = events[events.length - 1].created_at
        await supabase
          .from('list_subscription_batches')
          .insert({
            list_subscription_id: subscription.id,
            sent_at: new Date().toISOString(),
            last_event_at: latestEventTime
          })
      }
    }

    console.log(`Batch notification job completed. Sent ${emailsSent} emails.`)
    return { statusCode: 200, body: `Sent ${emailsSent} notification emails` }
  } catch (error) {
    console.error('Batch notification error:', error)
    return { statusCode: 500, body: 'Internal server error' }
  }
}

function groupEventsByType(events: SubscriptionEvent[]): EventSummary {
  return {
    item_added: events
      .filter(e => e.event_type === 'item_added')
      .map(e => ({ item_name: e.item_name })),
    item_removed: events
      .filter(e => e.event_type === 'item_removed')
      .map(e => ({ item_name: e.item_name })),
    item_claimed: events
      .filter(e => e.event_type === 'item_claimed')
      .map(e => ({
        item_name: e.item_name,
        claimed_by: e.metadata?.claimed_by
      })),
    item_unclaimed: events
      .filter(e => e.event_type === 'item_unclaimed')
      .map(e => ({ item_name: e.item_name }))
  }
}

async function sendNotificationEmail(
  email: string,
  listName: string,
  listId: string,
  summary: EventSummary,
  unsubscribeToken: string
): Promise<boolean> {
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?token=${unsubscribeToken}`
  const listUrl = `${process.env.NEXT_PUBLIC_APP_URL}/list/${listId}`

  const html = generateNotificationEmail(listName, summary, listUrl, unsubscribeUrl)

  try {
    await resend.emails.send({
      from: 'Clearly Gift <noreply@mail.clearly.gift>',
      to: email,
      subject: `[${listName}] Updates on your wishlist`,
      html
    })
    return true
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error)
    return false
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}
