'use client'

import { useState, useEffect, useRef, useMemo } from 'react'

type Category = 'All' | 'Hobbies' | 'Food & Drink' | 'Active' | 'Life Stage' | 'Budget' | 'Lifestyle'
type SortOption = 'popular' | 'newest' | 'az'

const categories: Category[] = ['All', 'Hobbies', 'Food & Drink', 'Active', 'Life Stage', 'Budget', 'Lifestyle']

interface Guide {
  title: string
  desc: string
  href: string
  image: string
  alt: string
  keywords: string[]
  category: Category
  updatedAt: string
}

const guides: Guide[] = [
  { title: "Top 10 Gift Ideas for Toddlers", desc: "10 perfect picks that'll keep the little ones happy and engaged, from educational toys to creative activities.", href: "/guides/top-10-gift-ideas-for-toddlers", image: "https://images.unsplash.com/photo-1707143017681-777ab2ac79a4?w=800&h=400&fit=crop", alt: "Gift ideas for toddlers", keywords: ["kids", "children", "baby", "toys", "family", "educational"], category: "Life Stage", updatedAt: "2025-02-01" },
  { title: "Top 10 Gift Ideas for Tech Lovers", desc: "Gadgets and accessories that won't break the bank but will definitely impress tech enthusiasts.", href: "/guides/top-10-gift-ideas-for-tech-lovers", image: "https://images.unsplash.com/photo-1585789574224-8cbf3247e581?w=800&h=400&fit=crop", alt: "Gift ideas for tech lovers", keywords: ["technology", "gadgets", "electronics", "geek", "nerd", "computer"], category: "Hobbies", updatedAt: "2025-01-28" },
  { title: "Top 10 Gift Ideas for Coffee Lovers", desc: "From beans to brewers, everything the caffeine connoisseur needs for the perfect cup.", href: "/guides/top-10-gift-ideas-for-coffee-lovers", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&h=400&fit=crop", alt: "Gift ideas for coffee lovers", keywords: ["caffeine", "espresso", "latte", "beans", "brewing", "barista"], category: "Food & Drink", updatedAt: "2025-02-10" },
  { title: "Top 10 Gift Ideas for Runners", desc: "Essential gear and accessories that will help runners achieve their personal best.", href: "/guides/top-10-gift-ideas-for-runners", image: "https://images.unsplash.com/photo-1758520706103-41d01f815640?w=800&h=400&fit=crop", alt: "Gift ideas for runners", keywords: ["running", "marathon", "jogging", "athletic", "sports", "exercise"], category: "Active", updatedAt: "2025-01-15" },
  { title: "Top 10 Gift Ideas for Food Lovers", desc: "Must-have tools and gadgets for anyone who loves to cook or bake at home.", href: "/guides/top-10-gift-ideas-for-food-lovers", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=400&fit=crop", alt: "Gift ideas for food lovers", keywords: ["cooking", "baking", "kitchen", "chef", "foodie", "culinary", "gourmet"], category: "Food & Drink", updatedAt: "2025-01-20" },
  { title: "Top 10 Gift Ideas for Gamers", desc: "From accessories to games, perfect gifts for gamers across all platforms and skill levels.", href: "/guides/top-10-gift-ideas-for-gamers", image: "https://images.unsplash.com/photo-1629917629391-47d9209b7c19?w=800&h=400&fit=crop", alt: "Gift ideas for gamers", keywords: ["gaming", "video games", "console", "pc", "playstation", "xbox", "nintendo"], category: "Hobbies", updatedAt: "2025-02-05" },
  { title: "Top 10 Gift Ideas for Book Lovers", desc: "Literary treasures and reading accessories for bibliophiles, from cozy reading nooks to rare editions.", href: "/guides/top-10-gift-ideas-for-book-lovers", image: "https://images.unsplash.com/photo-1709924168698-620ea32c3488?w=800&h=400&fit=crop", alt: "Gift ideas for book lovers", keywords: ["reading", "books", "literature", "kindle", "library", "bibliophile"], category: "Hobbies", updatedAt: "2025-01-12" },
  { title: "Top 10 Gift Ideas for Fitness Enthusiasts", desc: "Workout gear and wellness accessories to help fitness lovers reach their goals and recover better.", href: "/guides/top-10-gift-ideas-for-fitness-enthusiasts", image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=400&fit=crop", alt: "Gift ideas for fitness enthusiasts", keywords: ["gym", "workout", "exercise", "health", "training", "muscle", "crossfit"], category: "Active", updatedAt: "2025-01-25" },
  { title: "Top 10 Gift Ideas for New Parents", desc: "Thoughtful essentials and self-care items to support new parents through this exciting journey.", href: "/guides/top-10-gift-ideas-for-new-parents", image: "https://images.unsplash.com/photo-1542644416-2289c587843e?w=800&h=400&fit=crop", alt: "Gift ideas for new parents", keywords: ["baby", "mom", "dad", "parenting", "newborn", "family", "nursery"], category: "Life Stage", updatedAt: "2025-02-08" },
  { title: "Top 10 Gift Ideas for Wine Lovers", desc: "Elegant accessories and tasting essentials for wine enthusiasts and casual sippers alike.", href: "/guides/top-10-gift-ideas-for-wine-lovers", image: "https://images.unsplash.com/photo-1627626651107-7ce593b9bd76?w=800&h=400&fit=crop", alt: "Gift ideas for wine lovers", keywords: ["wine", "vineyard", "sommelier", "drinking", "alcohol", "vino", "red wine", "white wine"], category: "Food & Drink", updatedAt: "2025-01-18" },
  { title: "Top 10 Gift Ideas for Gardeners", desc: "Tools, plants, and outdoor accessories to help green thumbs create beautiful growing spaces.", href: "/guides/top-10-gift-ideas-for-gardeners", image: "https://images.unsplash.com/photo-1523301551780-cd17359a95d0?w=800&h=400&fit=crop", alt: "Gift ideas for gardeners", keywords: ["garden", "plants", "flowers", "outdoor", "green thumb", "landscaping", "herbs"], category: "Lifestyle", updatedAt: "2025-01-22" },
  { title: "Top 10 Gift Ideas for Travelers", desc: "Smart luggage, comfort accessories, and travel essentials for the jet-setter in your life.", href: "/guides/top-10-gift-ideas-for-travelers", image: "https://images.unsplash.com/photo-1512254921795-6be4058338b2?w=800&h=400&fit=crop", alt: "Gift ideas for travelers", keywords: ["travel", "vacation", "luggage", "adventure", "trip", "flying", "backpacking"], category: "Lifestyle", updatedAt: "2025-02-03" },
  { title: "Top 10 Gift Ideas for Artists", desc: "Creative supplies and digital tools to inspire and support artistic expression across all mediums.", href: "/guides/top-10-gift-ideas-for-artists", image: "https://images.unsplash.com/photo-1613744540922-2cbd526b8906?w=800&h=400&fit=crop", alt: "Gift ideas for artists", keywords: ["art", "painting", "drawing", "creative", "canvas", "sculpture", "design"], category: "Hobbies", updatedAt: "2025-01-30" },
  { title: "Top 10 Gift Ideas for Pet Owners", desc: "Thoughtful accessories and convenience items for devoted pet parents and their furry friends.", href: "/guides/top-10-gift-ideas-for-pet-owners", image: "https://images.unsplash.com/photo-1609138271629-571665f418a3?w=800&h=400&fit=crop", alt: "Gift ideas for pet owners", keywords: ["pets", "dogs", "cats", "animals", "puppy", "kitten", "fur baby"], category: "Lifestyle", updatedAt: "2025-02-12" },
  { title: "Top 10 Gift Ideas for Photographers", desc: "Professional gear and creative accessories for capturing life's moments with style and precision.", href: "/guides/top-10-gift-ideas-for-photographers", image: "https://images.unsplash.com/photo-1638128206917-d544cfb6e263?w=800&h=400&fit=crop", alt: "Gift ideas for photographers", keywords: ["photography", "camera", "lens", "photos", "portrait", "landscape", "digital"], category: "Hobbies", updatedAt: "2025-01-14" },
  { title: "Top 10 Gift Ideas for Teachers", desc: "Classroom essentials and appreciation gifts to show gratitude for dedicated educators.", href: "/guides/top-10-gift-ideas-for-teachers", image: "https://images.unsplash.com/photo-1544191046-397b734b0891?w=800&h=400&fit=crop", alt: "Gift ideas for teachers", keywords: ["teacher", "education", "school", "classroom", "professor", "teaching", "appreciation"], category: "Lifestyle", updatedAt: "2025-01-10" },
  { title: "Top 10 Gift Ideas for Wellness Lovers", desc: "Self-care essentials and mindful accessories for those prioritizing mental and physical wellness.", href: "/guides/top-10-gift-ideas-for-wellness-lovers", image: "https://images.unsplash.com/photo-1529693662653-9d480530a697?w=800&h=400&fit=crop", alt: "Gift ideas for wellness lovers", keywords: ["wellness", "self-care", "meditation", "yoga", "mindfulness", "spa", "relaxation"], category: "Lifestyle", updatedAt: "2025-02-06" },
  { title: "Top 10 Gift Ideas for Cyclists", desc: "High-performance gear and safety accessories for road cyclists and mountain biking enthusiasts.", href: "/guides/top-10-gift-ideas-for-cyclists", image: "https://images.unsplash.com/photo-1565121504582-6dbd18772bb2?w=800&h=400&fit=crop", alt: "Gift ideas for cyclists", keywords: ["cycling", "bike", "bicycle", "biking", "road bike", "mountain bike", "pedal"], category: "Active", updatedAt: "2025-01-16" },
  { title: "Top 10 Gift Ideas Under $25", desc: "Thoughtful and budget-friendly gifts that don't compromise on quality or meaning.", href: "/guides/top-10-gift-ideas-under-25", image: "https://images.unsplash.com/photo-1513726214296-1f2e95e452d8?w=800&h=400&fit=crop", alt: "Gift ideas under $25", keywords: ["budget", "cheap", "affordable", "inexpensive", "stocking stuffer", "under 25"], category: "Budget", updatedAt: "2025-02-14" },
  { title: "Top 10 Gift Ideas Under $50", desc: "Great value gifts that deliver maximum impact without breaking the budget.", href: "/guides/top-10-gift-ideas-under-50", image: "https://images.unsplash.com/photo-1638224966976-ae2e4257c09e?w=800&h=400&fit=crop", alt: "Gift ideas under $50", keywords: ["budget", "mid-range", "affordable", "value", "under 50"], category: "Budget", updatedAt: "2025-02-14" },
  { title: "Top 10 Luxury Gift Ideas", desc: "Premium and splurge-worthy gifts for life's most special occasions and celebrations.", href: "/guides/top-10-luxury-gift-ideas", image: "https://images.unsplash.com/photo-1759563871375-d5b140f6646e?w=800&h=400&fit=crop", alt: "Luxury gift ideas", keywords: ["luxury", "premium", "expensive", "splurge", "high-end", "designer", "upscale"], category: "Budget", updatedAt: "2025-01-26" },
  { title: "Top 10 Gift Ideas for Teenagers", desc: "Trendy accessories and experiences that capture the interests of today's teens.", href: "/guides/top-10-gift-ideas-for-teenagers", image: "https://images.unsplash.com/photo-1617392079938-d332e5d640e8?w=800&h=400&fit=crop", alt: "Gift ideas for teenagers", keywords: ["teen", "teenager", "youth", "trendy", "tween", "young adult"], category: "Life Stage", updatedAt: "2025-01-08" },
  { title: "Top 10 Gift Ideas for College Students", desc: "Dorm essentials and study tools to help students succeed in their academic journey.", href: "/guides/top-10-gift-ideas-for-college-students", image: "https://images.unsplash.com/photo-1547817651-7fb0cc360536?w=800&h=400&fit=crop", alt: "Gift ideas for college students", keywords: ["college", "university", "dorm", "student", "study", "school", "grad"], category: "Life Stage", updatedAt: "2025-01-05" },
  { title: "Top 10 Gift Ideas for Outdoor Adventurers", desc: "Camping gear and survival tools for those who love exploring the great outdoors.", href: "/guides/top-10-gift-ideas-for-outdoor-adventurers", image: "https://images.unsplash.com/photo-1604854436028-62dbf5fe81c5?w=800&h=400&fit=crop", alt: "Gift ideas for outdoor adventurers", keywords: ["outdoors", "camping", "hiking", "nature", "adventure", "wilderness", "backpacking"], category: "Active", updatedAt: "2025-02-11" },
  { title: "Top 10 Gift Ideas for DIY Enthusiasts", desc: "Quality tools and project kits for hands-on creators who love building and making.", href: "/guides/top-10-gift-ideas-for-diy-enthusiasts", image: "https://images.unsplash.com/photo-1685320198649-781e83a61de4?w=800&h=400&fit=crop", alt: "Gift ideas for DIY enthusiasts", keywords: ["diy", "crafts", "tools", "woodworking", "maker", "building", "handmade"], category: "Hobbies", updatedAt: "2025-01-19" },
  { title: "Top 10 Gift Ideas for Homebodies", desc: "Cozy comforts and entertainment essentials for those who love staying in and relaxing.", href: "/guides/top-10-gift-ideas-for-homebodies", image: "https://images.unsplash.com/photo-1763812384061-06b86c23ede6?w=800&h=400&fit=crop", alt: "Gift ideas for homebodies", keywords: ["home", "cozy", "comfort", "relaxation", "blanket", "candle", "indoor", "introvert"], category: "Lifestyle", updatedAt: "2025-01-23" },
]

const PAGE_SIZE = 12

function fuzzyMatch(guide: Guide, query: string): boolean {
  const q = query.toLowerCase().trim()
  if (!q) return true

  const words = q.split(/\s+/)
  const searchable = [
    guide.title.toLowerCase(),
    guide.desc.toLowerCase(),
    ...guide.keywords.map(k => k.toLowerCase()),
  ].join(' ')

  return words.every(word => searchable.includes(word))
}

function sortGuides(list: Guide[], sort: SortOption): Guide[] {
  if (sort === 'az') return [...list].sort((a, b) => a.title.localeCompare(b.title))
  if (sort === 'newest') return [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  return list // 'popular' = default order
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function isRecent(dateStr: string): boolean {
  const d = new Date(dateStr + 'T00:00:00')
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 30)
  return d >= cutoff
}

export default function GuideSearch() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category>('All')
  const [sort, setSort] = useState<SortOption>('popular')
  const [results, setResults] = useState(() => sortGuides(guides, 'popular'))
  const [loading, setLoading] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    const hasFilters = query.trim() || category !== 'All'

    if (!hasFilters && sort === 'popular') {
      setLoading(false)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      setResults(guides)
      return
    }

    setLoading(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      let filtered = guides
      if (category !== 'All') filtered = filtered.filter(g => g.category === category)
      if (query.trim()) filtered = filtered.filter(g => fuzzyMatch(g, query))
      setResults(sortGuides(filtered, sort))
      setLoading(false)
    }, 300)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, category, sort])

  const visible = showAll ? results : results.slice(0, PAGE_SIZE)
  const hasMore = results.length > PAGE_SIZE && !showAll

  const totalLabel = useMemo(() => {
    if (loading) return ''
    const showing = visible.length
    const total = results.length
    if (query.trim() || category !== 'All') {
      return `Showing ${showing}${hasMore ? ` of ${total}` : ''} result${total === 1 ? '' : 's'}`
    }
    return `Showing ${showing} of ${total} guide${total === 1 ? '' : 's'}`
  }, [loading, visible.length, results.length, hasMore, query, category])

  return (
    <>
      {/* Search */}
      <div className="max-w-xl mx-auto mb-6">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setShowAll(false) }}
            placeholder="Search guides... try &quot;budget&quot;, &quot;outdoors&quot;, &quot;mom&quot;"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-gray-900 placeholder-gray-400 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category pills + sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setShowAll(false) }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortOption)}
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
        >
          <option value="popular">Most Popular</option>
          <option value="newest">Recently Updated</option>
          <option value="az">A – Z</option>
        </select>
      </div>

      {/* Result count */}
      {totalLabel && (
        <p className="text-sm text-gray-500 mb-6">{totalLabel}</p>
      )}

      {/* Cards */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-6 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No guides found for &ldquo;{query}&rdquo;</p>
          <button onClick={() => { setQuery(''); setCategory('All') }} className="mt-3 text-emerald-600 hover:text-emerald-700 font-medium">
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visible.map((guide) => (
              <a
                key={guide.href}
                href={guide.href}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow block"
              >
                <div className="relative">
                  <img src={guide.image} alt={guide.alt} className="h-48 w-full object-cover" />
                  {isRecent(guide.updatedAt) && (
                    <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      Updated {formatDate(guide.updatedAt)}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{guide.category}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{guide.title}</h3>
                  <p className="text-gray-700 text-sm mb-4">{guide.desc}</p>
                  <span className="text-emerald-600 font-medium">Read Guide →</span>
                </div>
              </a>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAll(true)}
                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
              >
                Show All {results.length} Guides
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}
