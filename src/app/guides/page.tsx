import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gift Guides',
  description: 'Discover curated gift guides for every person and occasion. Find the perfect gifts for coffee lovers, tech enthusiasts, runners, toddlers, and more.',
  keywords: ['gift guides', 'gift ideas', 'present ideas', 'holiday gifts', 'birthday gifts', 'coffee gifts', 'tech gifts', 'running gifts'],
  openGraph: {
    title: 'Gift Guides | clearly.gift',
    description: 'Discover curated gift guides for every person and occasion. Find the perfect gifts for coffee lovers, tech enthusiasts, runners, toddlers, and more.',
    url: '/guides',
    type: 'website',
  },
  twitter: {
    title: 'Gift Guides | clearly.gift',
    description: 'Discover curated gift guides for every person and occasion. Find the perfect gifts for coffee lovers, tech enthusiasts, runners, toddlers, and more.',
    card: 'summary_large_image',
  },
}

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-lg sm:text-2xl font-bold text-gray-900">clearly.gift</span>
            </a>
            <div className="flex items-center gap-2 sm:gap-4">
              <a href="/" className="text-sm sm:text-base text-gray-700 hover:text-gray-900">
                Home
              </a>
              <a href="/auth" className="bg-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm sm:text-base whitespace-nowrap">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 px-4">Gift Guides</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto px-4">
            Curated collections of the best gifts for every person and occasion
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
              <span className="text-4xl">🧸</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Toddlers</h3>
              <p className="text-gray-700 text-sm mb-4">
                10 perfect picks that'll keep the little ones happy and engaged, from educational toys to creative activities.
              </p>
              <a href="/guides/top-10-gift-ideas-for-toddlers" className="text-sm sm:text-base text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
              <span className="text-4xl">💻</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Tech Lovers</h3>
              <p className="text-gray-700 text-sm mb-4">
                Gadgets and accessories that won't break the bank but will definitely impress tech enthusiasts.
              </p>
              <a href="/guides/top-10-gift-ideas-for-tech-lovers" className="text-sm sm:text-base text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              <span className="text-4xl">☕</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Coffee Lovers</h3>
              <p className="text-gray-700 text-sm mb-4">
                From beans to brewers, everything the caffeine connoisseur needs for the perfect cup.
              </p>
              <a href="/guides/top-10-gift-ideas-for-coffee-lovers" className="text-sm sm:text-base text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
              <span className="text-4xl">🏃‍♀️</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Runners</h3>
              <p className="text-gray-700 text-sm mb-4">
                Essential gear and accessories that will help runners achieve their personal best.
              </p>
              <a href="/guides/top-10-gift-ideas-for-runners" className="text-sm sm:text-base text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <span className="text-4xl">🍳</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Food Lovers</h3>
              <p className="text-gray-700 text-sm mb-4">
                Must-have tools and gadgets for anyone who loves to cook or bake at home.
              </p>
              <a href="/guides/top-10-gift-ideas-for-food-lovers" className="text-sm sm:text-base text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
              <span className="text-4xl">🎮</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Gamers</h3>
              <p className="text-gray-700 text-sm mb-4">
                From accessories to games, perfect gifts for gamers across all platforms and skill levels.
              </p>
              <a href="/guides/top-10-gift-ideas-for-gamers" className="text-sm sm:text-base text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>
          {/* High Priority - Coming Next */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center">
              <span className="text-4xl">📚</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Book Lovers</h3>
              <p className="text-gray-700 text-sm mb-4">
                Literary treasures and reading accessories for bibliophiles, from cozy reading nooks to rare editions.
              </p>
              <a href="/guides/top-10-gift-ideas-for-book-lovers" className="text-sm sm:text-base text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
              <span className="text-4xl">💪</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Fitness Enthusiasts</h3>
              <p className="text-gray-700 text-sm mb-4">
                Workout gear and wellness accessories to help fitness lovers reach their goals and recover better.
              </p>
              <a href="/guides/top-10-gift-ideas-for-fitness-enthusiasts" className="text-sm sm:text-base text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow opacity-75">
            <div className="h-48 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
              <span className="text-4xl">👶</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for New Parents</h3>
              <p className="text-gray-700 text-sm mb-4">
                Thoughtful essentials and self-care items to support new parents through this exciting journey.
              </p>
              <span className="text-sm sm:text-base text-gray-500 font-medium">Coming Soon</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow opacity-75">
            <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <span className="text-4xl">🍷</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Wine Lovers</h3>
              <p className="text-gray-700 text-sm mb-4">
                Elegant accessories and tasting essentials for wine enthusiasts and casual sippers alike.
              </p>
              <span className="text-sm sm:text-base text-gray-500 font-medium">Coming Soon</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow opacity-75">
            <div className="h-48 bg-gradient-to-br from-green-100 to-lime-100 flex items-center justify-center">
              <span className="text-4xl">🌱</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Gardeners</h3>
              <p className="text-gray-700 text-sm mb-4">
                Tools, plants, and outdoor accessories to help green thumbs create beautiful growing spaces.
              </p>
              <span className="text-sm sm:text-base text-gray-500 font-medium">Coming Soon</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow opacity-75">
            <div className="h-48 bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
              <span className="text-4xl">✈️</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Travelers</h3>
              <p className="text-gray-700 text-sm mb-4">
                Smart luggage, comfort accessories, and travel essentials for the jet-setter in your life.
              </p>
              <span className="text-sm sm:text-base text-gray-500 font-medium">Coming Soon</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow opacity-75">
            <div className="h-48 bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center">
              <span className="text-4xl">🎨</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Artists</h3>
              <p className="text-gray-700 text-sm mb-4">
                Creative supplies and digital tools to inspire and support artistic expression across all mediums.
              </p>
              <span className="text-sm sm:text-base text-gray-500 font-medium">Coming Soon</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow opacity-75">
            <div className="h-48 bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
              <span className="text-4xl">🐕</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Pet Owners</h3>
              <p className="text-gray-700 text-sm mb-4">
                Thoughtful accessories and convenience items for devoted pet parents and their furry friends.
              </p>
              <span className="text-sm sm:text-base text-gray-500 font-medium">Coming Soon</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow opacity-75">
            <div className="h-48 bg-gradient-to-br from-slate-100 to-gray-100 flex items-center justify-center">
              <span className="text-4xl">📸</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Photographers</h3>
              <p className="text-gray-700 text-sm mb-4">
                Professional gear and creative accessories for capturing life's moments with style and precision.
              </p>
              <span className="text-sm sm:text-base text-gray-500 font-medium">Coming Soon</span>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow opacity-75">
            <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <span className="text-4xl">🎓</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Teachers</h3>
              <p className="text-gray-700 text-sm mb-4">
                Classroom essentials and appreciation gifts to show gratitude for dedicated educators.
              </p>
              <span className="text-sm sm:text-base text-gray-500 font-medium">Coming Soon</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow opacity-75">
            <div className="h-48 bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
              <span className="text-4xl">🧘</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Wellness Lovers</h3>
              <p className="text-gray-700 text-sm mb-4">
                Self-care essentials and mindful accessories for those prioritizing mental and physical wellness.
              </p>
              <span className="text-sm sm:text-base text-gray-500 font-medium">Coming Soon</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow opacity-75">
            <div className="h-48 bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
              <span className="text-4xl">🚲</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Cyclists</h3>
              <p className="text-gray-700 text-sm mb-4">
                High-performance gear and safety accessories for road cyclists and mountain biking enthusiasts.
              </p>
              <span className="text-sm sm:text-base text-gray-500 font-medium">Coming Soon</span>
            </div>
          </div>

          {/* Budget Categories */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow opacity-75">
            <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
              <span className="text-4xl">💝</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas Under $25</h3>
              <p className="text-gray-700 text-sm mb-4">
                Thoughtful and budget-friendly gifts that don't compromise on quality or meaning.
              </p>
              <span className="text-sm sm:text-base text-gray-500 font-medium">Coming Soon</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow opacity-75">
            <div className="h-48 bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
              <span className="text-4xl">🎁</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas Under $50</h3>
              <p className="text-gray-700 text-sm mb-4">
                Great value gifts that deliver maximum impact without breaking the budget.
              </p>
              <span className="text-sm sm:text-base text-gray-500 font-medium">Coming Soon</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow opacity-75">
            <div className="h-48 bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
              <span className="text-4xl">💎</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Luxury Gift Ideas</h3>
              <p className="text-gray-700 text-sm mb-4">
                Premium and splurge-worthy gifts for life's most special occasions and celebrations.
              </p>
              <span className="text-sm sm:text-base text-gray-500 font-medium">Coming Soon</span>
            </div>
          </div>

          {/* Age & Life Stage */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow opacity-75">
            <div className="h-48 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
              <span className="text-4xl">🎸</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Teenagers</h3>
              <p className="text-gray-700 text-sm mb-4">
                Trendy accessories and experiences that capture the interests of today's teens.
              </p>
              <span className="text-sm sm:text-base text-gray-500 font-medium">Coming Soon</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow opacity-75">
            <div className="h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
              <span className="text-4xl">🎓</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for College Students</h3>
              <p className="text-gray-700 text-sm mb-4">
                Dorm essentials and study tools to help students succeed in their academic journey.
              </p>
              <span className="text-sm sm:text-base text-gray-500 font-medium">Coming Soon</span>
            </div>
          </div>

          {/* Specialized Interests */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow opacity-75">
            <div className="h-48 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
              <span className="text-4xl">🏕️</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Outdoor Adventurers</h3>
              <p className="text-gray-700 text-sm mb-4">
                Camping gear and survival tools for those who love exploring the great outdoors.
              </p>
              <span className="text-sm sm:text-base text-gray-500 font-medium">Coming Soon</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow opacity-75">
            <div className="h-48 bg-gradient-to-br from-gray-100 to-slate-100 flex items-center justify-center">
              <span className="text-4xl">🔧</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for DIY Enthusiasts</h3>
              <p className="text-gray-700 text-sm mb-4">
                Quality tools and project kits for hands-on creators who love building and making.
              </p>
              <span className="text-sm sm:text-base text-gray-500 font-medium">Coming Soon</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow opacity-75">
            <div className="h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
              <span className="text-4xl">🏠</span>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Homebodies</h3>
              <p className="text-gray-700 text-sm mb-4">
                Cozy comforts and entertainment essentials for those who love staying in and relaxing.
              </p>
              <span className="text-sm sm:text-base text-gray-500 font-medium">Coming Soon</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-12 px-4">
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            <strong>19 more comprehensive gift guides coming soon!</strong> We're working hard to bring you expert recommendations across every category.
          </p>
          <p className="text-gray-600 text-sm">
            Check back regularly for new guides, or follow us for updates when your favorite categories go live.
          </p>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-700">
          <p>&copy; 2025 clearly.gift. Share your wishlist, keep the surprise.</p>
          <p className="text-xs text-gray-500 mt-4">
            This site contains affiliate links. We may earn a commission when you purchase through these links at no additional cost to you.
          </p>
        </div>
      </footer>
    </div>
  )
}