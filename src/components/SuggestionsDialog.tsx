'use client'

import { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import type { GiftSuggestion } from '@/lib/gemini'

interface SuggestionsDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddItem: (suggestion: GiftSuggestion) => void
  listId: string
  listName: string
  items: { name: string; description?: string }[]
}

export default function SuggestionsDialog({
  isOpen,
  onClose,
  onAddItem,
  listId,
  listName,
  items,
}: SuggestionsDialogProps) {
  const [suggestions, setSuggestions] = useState<GiftSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [addedNames, setAddedNames] = useState<Set<string>>(new Set())

  const fetchSuggestions = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/suggest-gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId, listName, items }),
      })

      if (response.status === 429) {
        const data = await response.json()
        const seconds = data.retryAfterMs ? Math.ceil(data.retryAfterMs / 1000) : 60
        setError(`Please wait ${seconds} seconds before generating more suggestions.`)
        return
      }

      if (response.status === 503) {
        setError('AI suggestions are not available at this time.')
        return
      }

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to generate suggestions.')
        return
      }

      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [listId, listName, items])

  useEffect(() => {
    if (isOpen) {
      setSuggestions([])
      setAddedNames(new Set())
      setError(null)
      fetchSuggestions()
    }
  }, [isOpen, fetchSuggestions])

  const handleAdd = (suggestion: GiftSuggestion) => {
    onAddItem(suggestion)
    setAddedNames(prev => new Set(prev).add(suggestion.name))
    setSuggestions(prev => prev.filter(s => s.name !== suggestion.name))
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="max-w-lg w-full bg-white rounded-lg shadow-xl p-6 max-h-[80vh] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Gift Suggestions
            </DialogTitle>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {loading && (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-5 bg-gray-200 rounded w-16" />
                  </div>
                ))}
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-8">
                <div className="text-3xl mb-3">
                  {error.includes('wait') ? '⏳' : '😔'}
                </div>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
            )}

            {!loading && !error && suggestions.length === 0 && (
              <div className="text-center py-8">
                <div className="text-3xl mb-3">✨</div>
                <p className="text-sm text-gray-600">
                  {addedNames.size > 0
                    ? "You've added all the suggestions! Generate more or close this dialog."
                    : 'No suggestions available.'}
                </p>
              </div>
            )}

            {!loading && !error && suggestions.length > 0 && (
              <div className="space-y-3">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.name}
                    className="border border-gray-200 rounded-lg p-4 hover:border-emerald-200 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">{suggestion.name}</h4>
                        <p className="text-gray-600 text-xs mt-1">{suggestion.description}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                          {suggestion.priceRange}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAdd(suggestion)}
                        className="flex-shrink-0 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-gray-100">
            {!loading && (
              <button
                onClick={fetchSuggestions}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Generate More
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
