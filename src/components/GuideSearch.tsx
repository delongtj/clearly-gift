'use client'

import { useState, useMemo } from 'react'

interface Guide {
  title: string
  desc: string
  href: string
  image: string
  alt: string
  keywords: string[]
}

const guides: Guide[] = [
  { title: "Top 10 Gift Ideas for Toddlers", desc: "10 perfect picks that'll keep the little ones happy and engaged, from educational toys to creative activities.", href: "/guides/top-10-gift-ideas-for-toddlers", image: "https://images.unsplash.com/photo-1707143017681-777ab2ac79a4?w=800&h=400&fit=crop", alt: "Gift ideas for toddlers", keywords: ["kids", "children", "baby", "toys", "family", "educational"] },
  { title: "Top 10 Gift Ideas for Tech Lovers", desc: "Gadgets and accessories that won't break the bank but will definitely impress tech enthusiasts.", href: "/guides/top-10-gift-ideas-for-tech-lovers", image: "https://images.unsplash.com/photo-1585789574224-8cbf3247e581?w=800&h=400&fit=crop", alt: "Gift ideas for tech lovers", keywords: ["technology", "gadgets", "electronics", "geek", "nerd", "computer"] },
  { title: "Top 10 Gift Ideas for Coffee Lovers", desc: "From beans to brewers, everything the caffeine connoisseur needs for the perfect cup.", href: "/guides/top-10-gift-ideas-for-coffee-lovers", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&h=400&fit=crop", alt: "Gift ideas for coffee lovers", keywords: ["caffeine", "espresso", "latte", "beans", "brewing", "barista"] },
  { title: "Top 10 Gift Ideas for Runners", desc: "Essential gear and accessories that will help runners achieve their personal best.", href: "/guides/top-10-gift-ideas-for-runners", image: "https://images.unsplash.com/photo-1758520706103-41d01f815640?w=800&h=400&fit=crop", alt: "Gift ideas for runners", keywords: ["running", "marathon", "jogging", "athletic", "sports", "exercise"] },
  { title: "Top 10 Gift Ideas for Food Lovers", desc: "Must-have tools and gadgets for anyone who loves to cook or bake at home.", href: "/guides/top-10-gift-ideas-for-food-lovers", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=400&fit=crop", alt: "Gift ideas for food lovers", keywords: ["cooking", "baking", "kitchen", "chef", "foodie", "culinary", "gourmet"] },
  { title: "Top 10 Gift Ideas for Gamers", desc: "From accessories to games, perfect gifts for gamers across all platforms and skill levels.", href: "/guides/top-10-gift-ideas-for-gamers", image: "https://images.unsplash.com/photo-1629917629391-47d9209b7c19?w=800&h=400&fit=crop", alt: "Gift ideas for gamers", keywords: ["gaming", "video games", "console", "pc", "playstation", "xbox", "nintendo"] },
  { title: "Top 10 Gift Ideas for Book Lovers", desc: "Literary treasures and reading accessories for bibliophiles, from cozy reading nooks to rare editions.", href: "/guides/top-10-gift-ideas-for-book-lovers", image: "https://images.unsplash.com/photo-1709924168698-620ea32c3488?w=800&h=400&fit=crop", alt: "Gift ideas for book lovers", keywords: ["reading", "books", "literature", "kindle", "library", "bibliophile"] },
  { title: "Top 10 Gift Ideas for Fitness Enthusiasts", desc: "Workout gear and wellness accessories to help fitness lovers reach their goals and recover better.", href: "/guides/top-10-gift-ideas-for-fitness-enthusiasts", image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=400&fit=crop", alt: "Gift ideas for fitness enthusiasts", keywords: ["gym", "workout", "exercise", "health", "training", "muscle", "crossfit"] },
  { title: "Top 10 Gift Ideas for New Parents", desc: "Thoughtful essentials and self-care items to support new parents through this exciting journey.", href: "/guides/top-10-gift-ideas-for-new-parents", image: "https://images.unsplash.com/photo-1542644416-2289c587843e?w=800&h=400&fit=crop", alt: "Gift ideas for new parents", keywords: ["baby", "mom", "dad", "parenting", "newborn", "family", "nursery"] },
  { title: "Top 10 Gift Ideas for Wine Lovers", desc: "Elegant accessories and tasting essentials for wine enthusiasts and casual sippers alike.", href: "/guides/top-10-gift-ideas-for-wine-lovers", image: "https://images.unsplash.com/photo-1627626651107-7ce593b9bd76?w=800&h=400&fit=crop", alt: "Gift ideas for wine lovers", keywords: ["wine", "vineyard", "sommelier", "drinking", "alcohol", "vino", "red wine", "white wine"] },
  { title: "Top 10 Gift Ideas for Gardeners", desc: "Tools, plants, and outdoor accessories to help green thumbs create beautiful growing spaces.", href: "/guides/top-10-gift-ideas-for-gardeners", image: "https://images.unsplash.com/photo-1523301551780-cd17359a95d0?w=800&h=400&fit=crop", alt: "Gift ideas for gardeners", keywords: ["garden", "plants", "flowers", "outdoor", "green thumb", "landscaping", "herbs"] },
  { title: "Top 10 Gift Ideas for Travelers", desc: "Smart luggage, comfort accessories, and travel essentials for the jet-setter in your life.", href: "/guides/top-10-gift-ideas-for-travelers", image: "https://images.unsplash.com/photo-1512254921795-6be4058338b2?w=800&h=400&fit=crop", alt: "Gift ideas for travelers", keywords: ["travel", "vacation", "luggage", "adventure", "trip", "flying", "backpacking"] },
  { title: "Top 10 Gift Ideas for Artists", desc: "Creative supplies and digital tools to inspire and support artistic expression across all mediums.", href: "/guides/top-10-gift-ideas-for-artists", image: "https://images.unsplash.com/photo-1613744540922-2cbd526b8906?w=800&h=400&fit=crop", alt: "Gift ideas for artists", keywords: ["art", "painting", "drawing", "creative", "canvas", "sculpture", "design"] },
  { title: "Top 10 Gift Ideas for Pet Owners", desc: "Thoughtful accessories and convenience items for devoted pet parents and their furry friends.", href: "/guides/top-10-gift-ideas-for-pet-owners", image: "https://images.unsplash.com/photo-1609138271629-571665f418a3?w=800&h=400&fit=crop", alt: "Gift ideas for pet owners", keywords: ["pets", "dogs", "cats", "animals", "puppy", "kitten", "fur baby"] },
  { title: "Top 10 Gift Ideas for Photographers", desc: "Professional gear and creative accessories for capturing life's moments with style and precision.", href: "/guides/top-10-gift-ideas-for-photographers", image: "https://images.unsplash.com/photo-1638128206917-d544cfb6e263?w=800&h=400&fit=crop", alt: "Gift ideas for photographers", keywords: ["photography", "camera", "lens", "photos", "portrait", "landscape", "digital"] },
  { title: "Top 10 Gift Ideas for Teachers", desc: "Classroom essentials and appreciation gifts to show gratitude for dedicated educators.", href: "/guides/top-10-gift-ideas-for-teachers", image: "https://images.unsplash.com/photo-1544191046-397b734b0891?w=800&h=400&fit=crop", alt: "Gift ideas for teachers", keywords: ["teacher", "education", "school", "classroom", "professor", "teaching", "appreciation"] },
  { title: "Top 10 Gift Ideas for Wellness Lovers", desc: "Self-care essentials and mindful accessories for those prioritizing mental and physical wellness.", href: "/guides/top-10-gift-ideas-for-wellness-lovers", image: "https://images.unsplash.com/photo-1529693662653-9d480530a697?w=800&h=400&fit=crop", alt: "Gift ideas for wellness lovers", keywords: ["wellness", "self-care", "meditation", "yoga", "mindfulness", "spa", "relaxation"] },
  { title: "Top 10 Gift Ideas for Cyclists", desc: "High-performance gear and safety accessories for road cyclists and mountain biking enthusiasts.", href: "/guides/top-10-gift-ideas-for-cyclists", image: "https://images.unsplash.com/photo-1565121504582-6dbd18772bb2?w=800&h=400&fit=crop", alt: "Gift ideas for cyclists", keywords: ["cycling", "bike", "bicycle", "biking", "road bike", "mountain bike", "pedal"] },
  { title: "Top 10 Gift Ideas Under $25", desc: "Thoughtful and budget-friendly gifts that don't compromise on quality or meaning.", href: "/guides/top-10-gift-ideas-under-25", image: "https://images.unsplash.com/photo-1513726214296-1f2e95e452d8?w=800&h=400&fit=crop", alt: "Gift ideas under $25", keywords: ["budget", "cheap", "affordable", "inexpensive", "stocking stuffer", "under 25"] },
  { title: "Top 10 Gift Ideas Under $50", desc: "Great value gifts that deliver maximum impact without breaking the budget.", href: "/guides/top-10-gift-ideas-under-50", image: "https://images.unsplash.com/photo-1638224966976-ae2e4257c09e?w=800&h=400&fit=crop", alt: "Gift ideas under $50", keywords: ["budget", "mid-range", "affordable", "value", "under 50"] },
  { title: "Top 10 Luxury Gift Ideas", desc: "Premium and splurge-worthy gifts for life's most special occasions and celebrations.", href: "/guides/top-10-luxury-gift-ideas", image: "https://images.unsplash.com/photo-1759563871375-d5b140f6646e?w=800&h=400&fit=crop", alt: "Luxury gift ideas", keywords: ["luxury", "premium", "expensive", "splurge", "high-end", "designer", "upscale"] },
  { title: "Top 10 Gift Ideas for Teenagers", desc: "Trendy accessories and experiences that capture the interests of today's teens.", href: "/guides/top-10-gift-ideas-for-teenagers", image: "https://images.unsplash.com/photo-1617392079938-d332e5d640e8?w=800&h=400&fit=crop", alt: "Gift ideas for teenagers", keywords: ["teen", "teenager", "youth", "trendy", "tween", "young adult"] },
  { title: "Top 10 Gift Ideas for College Students", desc: "Dorm essentials and study tools to help students succeed in their academic journey.", href: "/guides/top-10-gift-ideas-for-college-students", image: "https://images.unsplash.com/photo-1547817651-7fb0cc360536?w=800&h=400&fit=crop", alt: "Gift ideas for college students", keywords: ["college", "university", "dorm", "student", "study", "school", "grad"] },
  { title: "Top 10 Gift Ideas for Outdoor Adventurers", desc: "Camping gear and survival tools for those who love exploring the great outdoors.", href: "/guides/top-10-gift-ideas-for-outdoor-adventurers", image: "https://images.unsplash.com/photo-1604854436028-62dbf5fe81c5?w=800&h=400&fit=crop", alt: "Gift ideas for outdoor adventurers", keywords: ["outdoors", "camping", "hiking", "nature", "adventure", "wilderness", "backpacking"] },
  { title: "Top 10 Gift Ideas for DIY Enthusiasts", desc: "Quality tools and project kits for hands-on creators who love building and making.", href: "/guides/top-10-gift-ideas-for-diy-enthusiasts", image: "https://images.unsplash.com/photo-1685320198649-781e83a61de4?w=800&h=400&fit=crop", alt: "Gift ideas for DIY enthusiasts", keywords: ["diy", "crafts", "tools", "woodworking", "maker", "building", "handmade"] },
  { title: "Top 10 Gift Ideas for Homebodies", desc: "Cozy comforts and entertainment essentials for those who love staying in and relaxing.", href: "/guides/top-10-gift-ideas-for-homebodies", image: "https://images.unsplash.com/photo-1763812384061-06b86c23ede6?w=800&h=400&fit=crop", alt: "Gift ideas for homebodies", keywords: ["home", "cozy", "comfort", "relaxation", "blanket", "candle", "indoor", "introvert"] },
]

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

export default function GuideSearch() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => guides.filter(g => fuzzyMatch(g, query)), [query])

  return (
    <>
      <div className="max-w-xl mx-auto mb-10">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
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

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No guides found for &ldquo;{query}&rdquo;</p>
          <button onClick={() => setQuery('')} className="mt-3 text-emerald-600 hover:text-emerald-700 font-medium">
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((guide) => (
            <a
              key={guide.href}
              href={guide.href}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow block"
            >
              <img src={guide.image} alt={guide.alt} className="h-48 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{guide.title}</h3>
                <p className="text-gray-700 text-sm mb-4">{guide.desc}</p>
                <span className="text-emerald-600 font-medium">Read Guide →</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  )
}
