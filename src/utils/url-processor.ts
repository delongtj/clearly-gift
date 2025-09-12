export interface AffiliateConfig {
  amazon?: string
  target?: string
  walmart?: string
  etsy?: string
}

const AFFILIATE_CONFIG: AffiliateConfig = {
  amazon: process.env.AMAZON_AFFILIATE_TAG,
  target: process.env.TARGET_AFFILIATE_ID,
  walmart: process.env.WALMART_AFFILIATE_ID,
  etsy: process.env.ETSY_AFFILIATE_ID,
}

export function processUrl(originalUrl: string): string {
  if (!originalUrl) return originalUrl

  try {
    const url = new URL(originalUrl)
    
    // Strip common tracking parameters
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
      'fbclid', 'gclid', 'msclkid', '_ga', 'mc_cid', 'mc_eid'
    ]
    
    trackingParams.forEach(param => {
      url.searchParams.delete(param)
    })

    // Add affiliate IDs based on domain
    if (url.hostname.includes('amazon.')) {
      // Remove existing affiliate tags
      url.searchParams.delete('tag')
      url.searchParams.delete('linkCode')
      url.searchParams.delete('linkId')
      
      if (AFFILIATE_CONFIG.amazon) {
        url.searchParams.set('tag', AFFILIATE_CONFIG.amazon)
      }
    } else if (url.hostname.includes('target.com')) {
      if (AFFILIATE_CONFIG.target) {
        url.searchParams.set('afid', AFFILIATE_CONFIG.target)
      }
    } else if (url.hostname.includes('walmart.com')) {
      if (AFFILIATE_CONFIG.walmart) {
        url.searchParams.set('wmlspartner', AFFILIATE_CONFIG.walmart)
      }
    } else if (url.hostname.includes('etsy.com')) {
      if (AFFILIATE_CONFIG.etsy) {
        url.searchParams.set('ref', AFFILIATE_CONFIG.etsy)
      }
    }

    return url.toString()
  } catch (error) {
    console.error('Error processing URL:', error)
    return originalUrl
  }
}

export function generateListToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}