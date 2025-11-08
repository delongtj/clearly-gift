import Link from "next/link"

export default function Home() {
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
              <Link href="/auth" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
              <Link href="/auth" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        <section className="py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            The simplest way to share your wish list
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Create beautiful, clutter-free wish lists that friends and family can view and claim gifts from - no sign-up required for them.
          </p>
          <Link href="/auth" className="bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-emerald-700 inline-block">
            Create Your First List
          </Link>
        </section>

        <section className="py-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-emerald-600 font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Dead Simple Setup</h3>
            <p className="text-gray-700">Just your email and a verification code. No lengthy forms or complex profiles.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-emerald-600 font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Share Instantly</h3>
            <p className="text-gray-700">Get a private link to share with family and friends. No accounts needed for them.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-emerald-600 font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Clean & Private</h3>
            <p className="text-gray-700">Beautifully minimal design. Others can claim items anonymously without seeing what's been taken.</p>
          </div>
        </section>

        <section className="py-16 bg-gray-50 rounded-2xl mb-16">
          <div className="px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Gift Guides</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2 text-gray-900">Top Gifts for Toddlers 2025</h3>
                <p className="text-gray-700 text-sm">10 perfect picks that'll keep the little ones happy and engaged.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2 text-gray-900">Best Tech Gifts Under $100</h3>
                <p className="text-gray-700 text-sm">Gadgets and accessories that won't break the bank.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2 text-gray-900">Gifts for Coffee Lovers</h3>
                <p className="text-gray-700 text-sm">From beans to brewers, everything for the caffeine connoisseur.</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link href="/guides" className="text-emerald-600 hover:text-emerald-700 font-medium">
                View All Guides →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
