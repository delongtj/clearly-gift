import Link from 'next/link'

export const metadata = {
  title: 'Unsubscribed - clearly.gift',
}

export default function UnsubscribeSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full text-center shadow-sm">
        <div className="text-5xl mb-4">👋</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Unsubscribed</h1>
        <p className="text-gray-600 mb-6">
          You've been removed from the list's email notifications. You won't receive any further updates about this list.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  )
}
