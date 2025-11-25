'use server'

import { processUrl } from '@/utils/url-processor'

export async function processUrlAction(url: string): Promise<string> {
  return await processUrl(url)
}
