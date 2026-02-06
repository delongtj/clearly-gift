import { Metadata } from 'next'
import GuidesHeader from '@/components/GuidesHeader'

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
<div className="bg-white">
<GuidesHeader />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gift Guides</h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Curated collections of the best gifts for every person and occasion
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1707143017681-777ab2ac79a4?w=800&h=400&fit=crop" alt="Gift ideas for toddlers" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Toddlers</h3>
              <p className="text-gray-700 text-sm mb-4">
                10 perfect picks that'll keep the little ones happy and engaged, from educational toys to creative activities.
              </p>
              <a href="/guides/top-10-gift-ideas-for-toddlers" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1585789574224-8cbf3247e581?w=800&h=400&fit=crop" alt="Gift ideas for tech lovers" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Tech Lovers</h3>
              <p className="text-gray-700 text-sm mb-4">
                Gadgets and accessories that won't break the bank but will definitely impress tech enthusiasts.
              </p>
              <a href="/guides/top-10-gift-ideas-for-tech-lovers" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&h=400&fit=crop" alt="Gift ideas for coffee lovers" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Coffee Lovers</h3>
              <p className="text-gray-700 text-sm mb-4">
                From beans to brewers, everything the caffeine connoisseur needs for the perfect cup.
              </p>
              <a href="/guides/top-10-gift-ideas-for-coffee-lovers" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1758520706103-41d01f815640?w=800&h=400&fit=crop" alt="Gift ideas for runners" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Runners</h3>
              <p className="text-gray-700 text-sm mb-4">
                Essential gear and accessories that will help runners achieve their personal best.
              </p>
              <a href="/guides/top-10-gift-ideas-for-runners" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=400&fit=crop" alt="Gift ideas for food lovers" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Food Lovers</h3>
              <p className="text-gray-700 text-sm mb-4">
                Must-have tools and gadgets for anyone who loves to cook or bake at home.
              </p>
              <a href="/guides/top-10-gift-ideas-for-food-lovers" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1629917629391-47d9209b7c19?w=800&h=400&fit=crop" alt="Gift ideas for gamers" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Gamers</h3>
              <p className="text-gray-700 text-sm mb-4">
                From accessories to games, perfect gifts for gamers across all platforms and skill levels.
              </p>
              <a href="/guides/top-10-gift-ideas-for-gamers" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>
          {/* High Priority - Coming Next */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1709924168698-620ea32c3488?w=800&h=400&fit=crop" alt="Gift ideas for book lovers" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Book Lovers</h3>
              <p className="text-gray-700 text-sm mb-4">
                Literary treasures and reading accessories for bibliophiles, from cozy reading nooks to rare editions.
              </p>
              <a href="/guides/top-10-gift-ideas-for-book-lovers" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=400&fit=crop" alt="Gift ideas for fitness enthusiasts" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Fitness Enthusiasts</h3>
              <p className="text-gray-700 text-sm mb-4">
                Workout gear and wellness accessories to help fitness lovers reach their goals and recover better.
              </p>
              <a href="/guides/top-10-gift-ideas-for-fitness-enthusiasts" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1542644416-2289c587843e?w=800&h=400&fit=crop" alt="Gift ideas for new parents" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for New Parents</h3>
              <p className="text-gray-700 text-sm mb-4">
                Thoughtful essentials and self-care items to support new parents through this exciting journey.
              </p>
              <a href="/guides/top-10-gift-ideas-for-new-parents" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1627626651107-7ce593b9bd76?w=800&h=400&fit=crop" alt="Gift ideas for wine lovers" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Wine Lovers</h3>
              <p className="text-gray-700 text-sm mb-4">
                Elegant accessories and tasting essentials for wine enthusiasts and casual sippers alike.
              </p>
              <a href="/guides/top-10-gift-ideas-for-wine-lovers" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1523301551780-cd17359a95d0?w=800&h=400&fit=crop" alt="Gift ideas for gardeners" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Gardeners</h3>
              <p className="text-gray-700 text-sm mb-4">
                Tools, plants, and outdoor accessories to help green thumbs create beautiful growing spaces.
              </p>
              <a href="/guides/top-10-gift-ideas-for-gardeners" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1512254921795-6be4058338b2?w=800&h=400&fit=crop" alt="Gift ideas for travelers" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Travelers</h3>
              <p className="text-gray-700 text-sm mb-4">
                Smart luggage, comfort accessories, and travel essentials for the jet-setter in your life.
              </p>
              <a href="/guides/top-10-gift-ideas-for-travelers" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1613744540922-2cbd526b8906?w=800&h=400&fit=crop" alt="Gift ideas for artists" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Artists</h3>
              <p className="text-gray-700 text-sm mb-4">
                Creative supplies and digital tools to inspire and support artistic expression across all mediums.
              </p>
              <a href="/guides/top-10-gift-ideas-for-artists" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <img src="https://images.unsplash.com/photo-1609138271629-571665f418a3?w=800&h=400&fit=crop" alt="Gift ideas for pet owners" className="h-48 w-full object-cover" />
          <div className="p-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Pet Owners</h3>
          <p className="text-gray-700 text-sm mb-4">
          Thoughtful accessories and convenience items for devoted pet parents and their furry friends.
          </p>
          <a href="/guides/top-10-gift-ideas-for-pet-owners" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Read Guide →
              </a>
             </div>
           </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1638128206917-d544cfb6e263?w=800&h=400&fit=crop" alt="Gift ideas for photographers" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Photographers</h3>
              <p className="text-gray-700 text-sm mb-4">
                Professional gear and creative accessories for capturing life's moments with style and precision.
              </p>
              <a href="/guides/top-10-gift-ideas-for-photographers" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1544191046-397b734b0891?w=800&h=400&fit=crop" alt="Gift ideas for teachers" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Teachers</h3>
              <p className="text-gray-700 text-sm mb-4">
                Classroom essentials and appreciation gifts to show gratitude for dedicated educators.
              </p>
              <a href="/guides/top-10-gift-ideas-for-teachers" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1529693662653-9d480530a697?w=800&h=400&fit=crop" alt="Gift ideas for wellness lovers" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Wellness Lovers</h3>
              <p className="text-gray-700 text-sm mb-4">
                Self-care essentials and mindful accessories for those prioritizing mental and physical wellness.
              </p>
              <a href="/guides/top-10-gift-ideas-for-wellness-lovers" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1565121504582-6dbd18772bb2?w=800&h=400&fit=crop" alt="Gift ideas for cyclists" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Cyclists</h3>
              <p className="text-gray-700 text-sm mb-4">
                High-performance gear and safety accessories for road cyclists and mountain biking enthusiasts.
              </p>
              <a href="/guides/top-10-gift-ideas-for-cyclists" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          {/* Budget Categories */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1513726214296-1f2e95e452d8?w=800&h=400&fit=crop" alt="Gift ideas under $25" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas Under $25</h3>
              <p className="text-gray-700 text-sm mb-4">
                Thoughtful and budget-friendly gifts that don't compromise on quality or meaning.
              </p>
              <a href="/guides/top-10-gift-ideas-under-25" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1638224966976-ae2e4257c09e?w=800&h=400&fit=crop" alt="Gift ideas under $50" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas Under $50</h3>
              <p className="text-gray-700 text-sm mb-4">
                Great value gifts that deliver maximum impact without breaking the budget.
              </p>
              <a href="/guides/top-10-gift-ideas-under-50" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1759563871375-d5b140f6646e?w=800&h=400&fit=crop" alt="Luxury gift ideas" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Luxury Gift Ideas</h3>
              <p className="text-gray-700 text-sm mb-4">
                Premium and splurge-worthy gifts for life's most special occasions and celebrations.
              </p>
              <a href="/guides/top-10-luxury-gift-ideas" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          {/* Age & Life Stage */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1617392079938-d332e5d640e8?w=800&h=400&fit=crop" alt="Gift ideas for teenagers" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Teenagers</h3>
              <p className="text-gray-700 text-sm mb-4">
                Trendy accessories and experiences that capture the interests of today's teens.
              </p>
              <a href="/guides/top-10-gift-ideas-for-teenagers" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1547817651-7fb0cc360536?w=800&h=400&fit=crop" alt="Gift ideas for college students" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for College Students</h3>
              <p className="text-gray-700 text-sm mb-4">
                Dorm essentials and study tools to help students succeed in their academic journey.
              </p>
              <a href="/guides/top-10-gift-ideas-for-college-students" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          {/* Specialized Interests */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1604854436028-62dbf5fe81c5?w=800&h=400&fit=crop" alt="Gift ideas for outdoor adventurers" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Outdoor Adventurers</h3>
              <p className="text-gray-700 text-sm mb-4">
                Camping gear and survival tools for those who love exploring the great outdoors.
              </p>
              <a href="/guides/top-10-gift-ideas-for-outdoor-adventurers" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1685320198649-781e83a61de4?w=800&h=400&fit=crop" alt="Gift ideas for DIY enthusiasts" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for DIY Enthusiasts</h3>
              <p className="text-gray-700 text-sm mb-4">
                Quality tools and project kits for hands-on creators who love building and making.
              </p>
              <a href="/guides/top-10-gift-ideas-for-diy-enthusiasts" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1763812384061-06b86c23ede6?w=800&h=400&fit=crop" alt="Gift ideas for homebodies" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top 10 Gift Ideas for Homebodies</h3>
              <p className="text-gray-700 text-sm mb-4">
                Cozy comforts and entertainment essentials for those who love staying in and relaxing.
              </p>
              <a href="/guides/top-10-gift-ideas-for-homebodies" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-700 mb-4">
            <strong>26 comprehensive gift guides</strong> covering every category — from tech lovers to outdoor adventurers, budget picks to luxury splurges.
          </p>
          <p className="text-gray-600 text-sm">
            Each guide features 10 hand-picked products with real prices and links to trusted retailers.
          </p>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-700">
          <p>&copy; 2025 clearly.gift. Share your wishlist. Keep the surprise</p>
          <p className="text-xs text-gray-500 mt-4">
            This site contains affiliate links. We may earn a commission when you purchase through these links at no additional cost to you.
          </p>
        </div>
      </footer>
    </div>
  )
}
