import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { token: string } }): Promise<Metadata> {
  // In a real app, you would fetch the list data here to get the actual name and item count
  // For now, we'll use generic metadata
  const { token } = await params
  
  return {
    title: 'Wish List',
    description: 'View this wish list and claim gifts for your loved ones. No sign-up required to view or claim items.',
    openGraph: {
      title: 'View Wish List | clearly.gift',
      description: 'View this wish list and claim gifts for your loved ones. No sign-up required to view or claim items.',
      url: `/list/${token}`,
      type: 'website',
    },
    twitter: {
      title: 'View Wish List | clearly.gift', 
      description: 'View this wish list and claim gifts for your loved ones. No sign-up required to view or claim items.',
      card: 'summary',
    },
    robots: {
      index: false, // Don't index individual lists for privacy
      follow: false,
    },
  }
}

export default function PublicListPage({ params }: { params: { token: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">clearly.gift</span>
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 min-w-0 break-words">Sample Wish List</h1>
            <div className="text-sm text-gray-500 whitespace-nowrap shrink-0">
              <span>12 views</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">A collection of things I'd love to receive as gifts</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Wireless Noise-Cancelling Headphones</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Perfect for working from home and blocking out distractions
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>24 clicks</span>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-2 sm:gap-2 shrink-0">
                <a
                  href="#"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center text-sm whitespace-nowrap flex-1 sm:flex-initial"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Item
                </a>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm whitespace-nowrap flex-1 sm:flex-initial">
                  Claim Gift
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 opacity-60">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-medium text-gray-500 mb-2 line-through">Coffee Subscription</h3>
                <p className="text-gray-500 text-sm mb-3">
                  Monthly delivery of freshly roasted coffee beans
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>Claimed by Sarah</span>
                  <span>8 clicks</span>
                </div>
              </div>
              <div className="shrink-0">
                <div className="bg-gray-200 text-gray-500 px-4 py-2 rounded-lg text-sm whitespace-nowrap">
                  Already Claimed
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Kindle E-reader</h3>
                <p className="text-gray-600 text-sm mb-3">
                  For reading books without the bulk of physical copies
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>15 clicks</span>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-2 sm:gap-2 shrink-0">
                <a
                  href="#"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center text-sm whitespace-nowrap flex-1 sm:flex-initial"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Item
                </a>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm whitespace-nowrap flex-1 sm:flex-initial">
                  Claim Gift
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm mb-2">
            This list was created with
          </p>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <span className="text-lg font-bold text-gray-900">clearly.gift</span>
          </div>
          <p className="text-xs text-gray-500">
            This site contains affiliate links. We may earn a commission when you purchase through these links at no additional cost to you.
          </p>
        </div>
      </footer>
    </div>
  )
}