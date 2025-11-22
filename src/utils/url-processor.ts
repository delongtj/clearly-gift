import { nanoid } from 'nanoid'

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

async function expandShortUrl(url: string): Promise<string> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 1000)

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ClearlyGift/1.0)'
        }
      })

      clearTimeout(timeoutId)

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location')
        return location || url
      }
      
      return url
    } catch (error) {
      clearTimeout(timeoutId)
      // Fallback to unshorten.me for URLs that don't support HEAD (e.g., a.co)
      return await expandViaService(url)
    }
  } catch {
    return url
  }
}

async function expandViaService(url: string): Promise<string> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000)

    const response = await fetch(`https://unshorten.me/json/${encodeURIComponent(url)}`, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json() as { resolved_url?: string }
      return data.resolved_url || url
    }
    
    return url
  } catch {
    return url
  }
}

export async function processUrl(originalUrl: string): Promise<string> {
  if (!originalUrl) return originalUrl

  try {
    // Expand short URLs first
    const expandedUrl = await expandShortUrl(originalUrl)
    const url = new URL(expandedUrl)
    
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
  return nanoid()
}