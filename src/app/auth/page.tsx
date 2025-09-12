import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to clearly.gift to create and manage your wish lists. Enter your email to get started - no complex registration required.',
  openGraph: {
    title: 'Sign In | clearly.gift',
    description: 'Sign in to clearly.gift to create and manage your wish lists. Enter your email to get started - no complex registration required.',
    url: '/auth',
  },
  twitter: {
    title: 'Sign In | clearly.gift',
    description: 'Sign in to clearly.gift to create and manage your wish lists. Enter your email to get started - no complex registration required.',
  },
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg mx-auto mb-4 flex items-center justify-center hover:bg-emerald-700 transition-colors">
              <span className="text-white font-bold">C</span>
            </div>
          </a>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to clearly.gift</h1>
          <p className="text-gray-600 mt-2">Share your wishlist, keep the surprise</p>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="you@example.com"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 font-medium"
          >
            Continue
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            We'll send you a verification code to sign in
          </p>
        </div>
      </div>
      
      <footer className="absolute bottom-0 w-full py-4">
        <div className="max-w-md mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            This site contains affiliate links. We may earn a commission when you purchase through these links at no additional cost to you.
          </p>
        </div>
      </footer>
    </div>
  )
}