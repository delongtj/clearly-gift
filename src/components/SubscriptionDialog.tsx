import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'

interface SubscriptionDialogProps {
  isOpen: boolean
  onClose: () => void
  listId: string
}

export default function SubscriptionDialog({
  isOpen,
  onClose,
  listId
}: SubscriptionDialogProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ list_id: listId, email: email.trim() })
      })

      if (!response.ok) {
        throw new Error('Failed to subscribe')
      }

      setStatus('success')
      setMessage('Check your email to verify your subscription!')
      setEmail('')
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (error) {
      setStatus('error')
      setMessage('Failed to subscribe. Please try again.')
      console.error('Subscription error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setEmail('')
    setStatus('idle')
    setMessage('')
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="max-w-md w-full bg-white rounded-lg shadow-xl p-6">
          <DialogTitle className="text-lg font-semibold text-gray-900 mb-2">
            Subscribe to Changes
          </DialogTitle>
          <p className="text-sm text-gray-600 mb-4">
            Get email notifications when items are added, claimed, or removed from this list.
          </p>

          {status === 'success' ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-700">
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 mb-4"
                autoFocus
                required
              />
              {status === 'error' && (
                <p className="text-sm text-red-600 mb-4">{message}</p>
              )}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </form>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  )
}
