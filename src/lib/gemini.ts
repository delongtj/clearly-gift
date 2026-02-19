export interface GiftSuggestion {
  name: string
  description: string
  priceRange: string
}

interface ListContext {
  listName: string
  items: { name: string; description?: string }[]
}

const BLOCKED_KEYWORDS = [
  'weapon', 'gun', 'firearm', 'ammunition', 'knife', 'sword',
  'drug', 'cannabis', 'marijuana', 'cocaine', 'heroin', 'opioid',
  'alcohol', 'beer', 'wine', 'liquor', 'vodka', 'whiskey',
  'tobacco', 'cigarette', 'vape', 'nicotine',
  'sexual', 'erotic', 'lingerie', 'adult toy', 'pornograph',
  'gambling', 'casino', 'betting',
  'explosive', 'bomb', 'grenade',
]

import { isMeaningfulItem } from '@/lib/item-quality'

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim()
}

function sanitizeInput(context: ListContext): ListContext {
  return {
    listName: stripHtml(context.listName).slice(0, 100),
    items: context.items.slice(0, 20)
      .map(item => ({
        name: stripHtml(item.name).slice(0, 100),
        description: item.description ? stripHtml(item.description).slice(0, 200) : undefined,
      }))
      .filter(item => isMeaningfulItem(item.name)),
  }
}

function buildPrompt(context: ListContext): { systemInstruction: string; userPrompt: string } {
  const systemInstruction = `You are a helpful gift suggestion assistant for a family-friendly gift wishlist website.

RULES:
- Only suggest physical gift items that are appropriate for all ages
- Suggestions must be related to the items already on the list
- NEVER suggest items in these prohibited categories: weapons, firearms, knives, drugs, alcohol, tobacco, vaping, sexual/adult content, gambling, explosives, or anything illegal
- Each suggestion must include a name, brief description (1 sentence), and approximate price range
- Return exactly 5 suggestions as a JSON array
- Keep suggestions practical and purchasable from major retailers
- Do not include URLs or specific brand recommendations unless directly relevant

RESPONSE FORMAT:
Return a JSON array of objects with these exact fields:
[{"name": "...", "description": "...", "priceRange": "..."}]
The priceRange should be like "$20-40" or "Under $25" or "$50-100".`

  const itemList = context.items
    .map(i => i.description ? `- ${i.name}: ${i.description}` : `- ${i.name}`)
    .join('\n')

  const userPrompt = `Here is a gift list called "${context.listName}" with these items:
${itemList}

Suggest 5 related gift ideas that complement this list.`

  return { systemInstruction, userPrompt }
}

async function callGemini(systemInstruction: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not configured')
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_LOW_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
          ],
        }),
      }
    )

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Gemini API error ${response.status}: ${errorBody}`)
    }

    const data = await response.json()

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text
    }

    if (data.candidates?.[0]?.finishReason === 'SAFETY') {
      throw new Error('Response blocked by Gemini safety filters')
    }

    throw new Error('Unexpected Gemini response structure')
  } finally {
    clearTimeout(timeout)
  }
}

function validateSuggestions(raw: string): GiftSuggestion[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('Failed to parse Gemini response as JSON')
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Gemini response is not an array')
  }

  return parsed
    .filter((item): item is { name: string; description: string; priceRange: string } => {
      if (!item || typeof item !== 'object') return false
      if (typeof item.name !== 'string' || typeof item.description !== 'string' || typeof item.priceRange !== 'string') return false
      if (!item.name.trim() || !item.description.trim()) return false

      // Keyword blocklist check
      const combined = `${item.name} ${item.description}`.toLowerCase()
      return !BLOCKED_KEYWORDS.some(keyword => combined.includes(keyword))
    })
    .slice(0, 5)
    .map(item => ({
      name: item.name.trim().slice(0, 100),
      description: item.description.trim().slice(0, 200),
      priceRange: item.priceRange.trim().slice(0, 20),
    }))
}

export async function suggestGifts(context: ListContext): Promise<GiftSuggestion[]> {
  const sanitized = sanitizeInput(context)

  if (sanitized.items.length === 0) {
    throw new Error('Add some real gift ideas to your list first — we need at least one to suggest from.')
  }

  const { systemInstruction, userPrompt } = buildPrompt(sanitized)
  const raw = await callGemini(systemInstruction, userPrompt)
  const suggestions = validateSuggestions(raw)

  if (suggestions.length === 0) {
    throw new Error('No safe suggestions could be generated')
  }

  return suggestions
}
