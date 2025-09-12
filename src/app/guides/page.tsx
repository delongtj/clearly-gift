export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">clearly.gift</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </a>
              <a href="/auth" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gift Guides</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Curated collections of the best gifts for every person and occasion
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
              <span className="text-4xl">🧸</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Top Gifts for Toddlers 2025</h3>
              <p className="text-gray-600 text-sm mb-4">
                10 perfect picks that'll keep the little ones happy and engaged, from educational toys to creative activities.
              </p>
              <a href="/guides/toddlers-2025" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
              <span className="text-4xl">💻</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Best Tech Gifts Under $100</h3>
              <p className="text-gray-600 text-sm mb-4">
                Gadgets and accessories that won't break the bank but will definitely impress tech enthusiasts.
              </p>
              <a href="/guides/tech-under-100" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              <span className="text-4xl">☕</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Gifts for Coffee Lovers</h3>
              <p className="text-gray-600 text-sm mb-4">
                From beans to brewers, everything the caffeine connoisseur needs for the perfect cup.
              </p>
              <a href="/guides/coffee-lovers" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
              <span className="text-4xl">🏃‍♀️</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Top Gifts for Runners</h3>
              <p className="text-gray-600 text-sm mb-4">
                Essential gear and accessories that will help runners achieve their personal best.
              </p>
              <a href="/guides/runners" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <span className="text-4xl">🍳</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Kitchen Essentials for Food Lovers</h3>
              <p className="text-gray-600 text-sm mb-4">
                Must-have tools and gadgets for anyone who loves to cook or bake at home.
              </p>
              <a href="/guides/kitchen-essentials" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
              <span className="text-4xl">🎮</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Best Gaming Gifts 2025</h3>
              <p className="text-gray-600 text-sm mb-4">
                From accessories to games, perfect gifts for gamers across all platforms and skill levels.
              </p>
              <a href="/guides/gaming-gifts" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Read Guide →
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            More guides coming soon! Check back regularly for new gift ideas.
          </p>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 clearly.gift. Share your wishlist, keep the surprise.</p>
        </div>
      </footer>
    </div>
  )
}