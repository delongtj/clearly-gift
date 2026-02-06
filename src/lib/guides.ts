import fs from 'fs'
import path from 'path'

export interface GuideFrontmatter {
  title: string
  description: string
  date: string
  category: string
  author: string
  slug: string
  featured: boolean | string
  emoji?: string
  heroImage?: string
  heroImageCredit?: string
}

export interface GuideMetadata {
  frontmatter: GuideFrontmatter
  slug: string
}

export interface Guide extends GuideMetadata {
  content: string
}

const GUIDES_DIR = path.join(process.cwd(), 'content/guides')

export const categoryEmoji: Record<string, string> = {
  'Kids & Family': '🧸',
  'Technology': '💻',
  'Coffee & Kitchen': '☕',
  'Sports & Fitness': '🏃‍♀️',
  'Kitchen & Cooking': '🍳',
  'Gaming': '🎮',
  'Books & Reading': '📚',
  'Fitness & Wellness': '💪',
  'Beverages & Wine': '🍷',
  'Pets': '🐕',
  'Baby & Parenting': '👶',
  'Garden & Outdoors': '🌱',
  'Travel': '✈️',
}

export const categoryGradient: Record<string, { from: string; to: string; accent: string; textColor: string }> = {
  'Kids & Family':      { from: 'from-pink-50',    to: 'to-purple-100',  accent: '#ec4899', textColor: 'text-pink-800' },
  'Technology':         { from: 'from-blue-50',     to: 'to-cyan-100',    accent: '#0ea5e9', textColor: 'text-blue-800' },
  'Coffee & Kitchen':   { from: 'from-amber-50',    to: 'to-orange-100',  accent: '#f59e0b', textColor: 'text-amber-800' },
  'Sports & Fitness':   { from: 'from-green-50',    to: 'to-emerald-100', accent: '#10b981', textColor: 'text-green-800' },
  'Kitchen & Cooking':  { from: 'from-purple-50',   to: 'to-pink-100',    accent: '#a855f7', textColor: 'text-purple-800' },
  'Gaming':             { from: 'from-red-50',      to: 'to-pink-100',    accent: '#ef4444', textColor: 'text-red-800' },
  'Books & Reading':    { from: 'from-yellow-50',   to: 'to-amber-100',   accent: '#eab308', textColor: 'text-yellow-800' },
  'Fitness & Wellness': { from: 'from-orange-50',   to: 'to-red-100',     accent: '#f97316', textColor: 'text-orange-800' },
  'Beverages & Wine':   { from: 'from-indigo-50',   to: 'to-purple-100',  accent: '#6366f1', textColor: 'text-indigo-800' },
  'Pets':               { from: 'from-emerald-50',  to: 'to-green-100',   accent: '#10b981', textColor: 'text-emerald-800' },
  'Baby & Parenting':   { from: 'from-rose-50',     to: 'to-pink-100',    accent: '#f43f5e', textColor: 'text-rose-800' },
  'Garden & Outdoors':  { from: 'from-green-50',    to: 'to-lime-100',    accent: '#84cc16', textColor: 'text-green-800' },
  'Travel':             { from: 'from-teal-50',     to: 'to-cyan-100',    accent: '#14b8a6', textColor: 'text-teal-800' },
}

const DEFAULT_GRADIENT = { from: 'from-gray-50', to: 'to-gray-100', accent: '#6b7280', textColor: 'text-gray-800' }

function parseFrontmatter(fileContent: string): { frontmatter: GuideFrontmatter; content: string } | null {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/
  const match = frontmatterRegex.exec(fileContent)

  if (!match) return null

  const frontmatterText = match[1]
  const content = fileContent.replace(frontmatterRegex, '')

  const frontmatter: Record<string, string> = {}
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '')
      frontmatter[key] = value
    }
  })

  return { frontmatter: frontmatter as unknown as GuideFrontmatter, content }
}

export function getGuide(slug: string): Guide | null {
  try {
    const filePath = path.join(GUIDES_DIR, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) return null

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const parsed = parseFrontmatter(fileContent)
    if (!parsed) return null

    return { frontmatter: parsed.frontmatter, content: parsed.content, slug }
  } catch (error) {
    console.error('Error reading guide:', error)
    return null
  }
}

export function getAllGuides(): GuideMetadata[] {
  if (!fs.existsSync(GUIDES_DIR)) return []

  return fs.readdirSync(GUIDES_DIR)
    .filter(name => name.endsWith('.mdx'))
    .map(name => {
      const slug = name.replace('.mdx', '')
      const filePath = path.join(GUIDES_DIR, name)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const parsed = parseFrontmatter(fileContent)
      if (!parsed) return null
      return { frontmatter: parsed.frontmatter, slug }
    })
    .filter((g): g is GuideMetadata => g !== null)
}

export function getRelatedGuides(currentSlug: string, category: string, count = 3): GuideMetadata[] {
  const allGuides = getAllGuides()
  const otherGuides = allGuides.filter(g => g.slug !== currentSlug)
  const sameCategory = otherGuides.filter(g => g.frontmatter.category === category)
  const differentCategory = otherGuides.filter(g => g.frontmatter.category !== category)

  return [...sameCategory, ...differentCategory].slice(0, count)
}

export function getEmojiForGuide(guide: Guide | GuideMetadata): string {
  return guide.frontmatter.emoji || categoryEmoji[guide.frontmatter.category] || '🎁'
}

export function getGradientForCategory(category: string) {
  return categoryGradient[category] || DEFAULT_GRADIENT
}
