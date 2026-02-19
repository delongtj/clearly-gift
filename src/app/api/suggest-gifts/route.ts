import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { suggestGifts } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { listId, listName, items } = await request.json()

    if (!listId || !listName || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: listId, listName, and items (non-empty array)' },
        { status: 400 }
      )
    }

    // Check rate limit
    if (!checkRateLimit().allowed) {
      return NextResponse.json(
        { error: 'System busy. Try again later.' },
        { status: 429 }
      )
    }

    // Check API key
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI suggestions are not available at this time.' },
        { status: 503 }
      )
    }

    const suggestions = await suggestGifts({
      listName,
      items: items.map((i: { name: string; description?: string }) => ({
        name: i.name,
        description: i.description,
      })),
    })

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('[API] Suggest gifts error:', error)
    const message = error instanceof Error ? error.message : 'Failed to generate suggestions'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
