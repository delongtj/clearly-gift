import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

interface MetadataResponse {
  title?: string
  description?: string
  image?: string
  url?: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Fetch the page with a realistic User-Agent and timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    let response: Response
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeoutId)
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
        { status: 400 }
      )
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract Open Graph metadata
    const metadata: MetadataResponse = {
      url,
    }

    // Try Open Graph tags first (most reliable)
    const ogTitle = $('meta[property="og:title"]').attr('content')
    const ogDescription = $('meta[property="og:description"]').attr('content')
    const ogImage = $('meta[property="og:image"]').attr('content')

    if (ogTitle) metadata.title = ogTitle
    if (ogDescription) metadata.description = ogDescription
    if (ogImage) metadata.image = ogImage

    // Fallback to regular meta tags if OG tags not found
    if (!metadata.title) {
      const pageTitle = $('meta[name="title"]').attr('content') || $('title').text()
      if (pageTitle) metadata.title = pageTitle
    }

    if (!metadata.description) {
      const pageDesc = $('meta[name="description"]').attr('content')
      if (pageDesc) metadata.description = pageDesc
    }

    return NextResponse.json(metadata)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Metadata fetch error:', message)
    
    return NextResponse.json(
      { error: `Failed to fetch metadata: ${message}` },
      { status: 500 }
    )
  }
}
