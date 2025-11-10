import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your wish lists on clearly.gift. Create new lists, edit existing ones, and share them with friends and family.',
  openGraph: {
    title: 'Dashboard | clearly.gift',
    description: 'Manage your wish lists on clearly.gift. Create new lists, edit existing ones, and share them with friends and family.',
    url: '/dashboard',
  },
  twitter: {
    title: 'Dashboard | clearly.gift',
    description: 'Manage your wish lists on clearly.gift. Create new lists, edit existing ones, and share them with friends and family.',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">clearly.gift</span>
            </a>
            <div className="flex items-center space-x-4">
              <button className="text-sm sm:text-base text-gray-600 hover:text-gray-900">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Lists</h1>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 whitespace-nowrap text-sm sm:text-base">
            Create New List
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Create your first list</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Share your wishlist, keep the surprise
          </p>
          <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 text-sm sm:text-base">
            Create Your First List
          </button>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            This site contains affiliate links. We may earn a commission when you purchase through these links at no additional cost to you.
          </p>
        </div>
      </footer>
    </div>
  )
}