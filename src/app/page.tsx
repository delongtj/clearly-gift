import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-lg sm:text-2xl font-bold text-gray-900">clearly.gift</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/auth" className="text-sm sm:text-base text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
              <Link href="/auth" className="bg-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm sm:text-base whitespace-nowrap">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        <section className="py-12 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 px-4">
            The simplest way to share your wish list
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto px-4">
            Create beautiful, clutter-free wish lists that friends and family can view and claim gifts from - no sign-up required for them.
          </p>
          <Link href="/auth" className="bg-emerald-600 text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg hover:bg-emerald-700 inline-block">
            Create Your First List
          </Link>
        </section>

        <section className="py-12 sm:py-16 grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center px-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-emerald-600 font-bold">1</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Dead Simple Setup</h3>
            <p className="text-sm sm:text-base text-gray-700">Just your email and a verification code. No lengthy forms or complex profiles.</p>
          </div>
          <div className="text-center px-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-emerald-600 font-bold">2</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Share Instantly</h3>
            <p className="text-sm sm:text-base text-gray-700">Get a private link to share with family and friends. No accounts needed for them.</p>
          </div>
          <div className="text-center px-4 sm:col-span-2 md:col-span-1">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-emerald-600 font-bold">3</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Clean & Private</h3>
            <p className="text-sm sm:text-base text-gray-700">Beautifully minimal design. Others can claim items anonymously without seeing what's been taken.</p>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-gray-50 rounded-2xl mb-12 sm:mb-16">
          <div className="px-4 sm:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-900">Gift Guides</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">Top Gifts for Toddlers 2025</h3>
                <p className="text-gray-700 text-sm">10 perfect picks that'll keep the little ones happy and engaged.</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">Best Tech Gifts Under $100</h3>
                <p className="text-gray-700 text-sm">Gadgets and accessories that won't break the bank.</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm sm:col-span-2 md:col-span-1">
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">Gifts for Coffee Lovers</h3>
                <p className="text-gray-700 text-sm">From beans to brewers, everything for the caffeine connoisseur.</p>
              </div>
            </div>
            <div className="text-center mt-6 sm:mt-8">
              <Link href="/guides" className="text-sm sm:text-base text-emerald-600 hover:text-emerald-700 font-medium">
                View All Guides →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-700 mb-4">&copy; 2025 clearly.gift. Share your wishlist, keep the surprise.</p>
          <p className="text-xs text-gray-500">
            This site contains affiliate links. We may earn a commission when you purchase through these links at no additional cost to you.
          </p>
        </div>
      </footer>
    </div>
  )
}
