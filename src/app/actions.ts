'use server'

import { processUrl } from '@/utils/url-processor'
import { fetchUrlMetadata, type UrlMetadata } from '@/lib/metadata'

export async function processUrlAction(url: string): Promise<string> {
  return await processUrl(url)
}

export async function fetchMetadataAction(url: string): Promise<UrlMetadata> {
  let normalizedUrl = url.trim()
  if (normalizedUrl && !normalizedUrl.match(/^https?:\/\//i)) {
    normalizedUrl = `https://${normalizedUrl}`
  }
  return fetchUrlMetadata(normalizedUrl)
}
