'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { List, Item } from '@/types/database'
import ConfirmDialog from '@/components/ConfirmDialog'
import InputDialog from '@/components/InputDialog'
import Toast from '@/components/Toast'

interface PublicListClientProps {
  token: string
}

export default function PublicListClient({ token }: PublicListClientProps) {
  const [list, setList] = useState<List | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [isOwnList, setIsOwnList] = useState(false)

  // Dialog states
  const [showNameInput, setShowNameInput] = useState(false)
  const [itemToClaim, setItemToClaim] = useState<Item | null>(null)
  const [showUnclaimConfirm, setShowUnclaimConfirm] = useState(false)
  const [itemToUnclaim, setItemToUnclaim] = useState<Item | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success')

  useEffect(() => {
    loadList()
  }, [token])

  const loadList = async () => {
    setLoading(true)

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()

    // Load list
    const { data: listData, error: listError } = await supabase
      .from('lists')
      .select('*')
      .eq('token', token)
      .single()

    if (listError || !listData) {
      console.error('Error loading list:', listError)
      setLoading(false)
      return
    }

    const list = listData as List
    setList(list)

    // Check if this is the user's own list
    if (user && list.user_id === user.id) {
      setIsOwnList(true)
      setLoading(false)
      return
    }

    // Load items
    const { data: itemsData, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .eq('list_id', list.id)
      .order('created_at', { ascending: true })

    if (itemsError) {
      console.error('Error loading items:', itemsError)
    } else {
      setItems((itemsData as Item[]) || [])
    }

    // Increment view count
    await supabase
      .from('lists')
      // @ts-expect-error - Type inference issue with Supabase client
      .update({ view_count: (list.view_count || 0) + 1 })
      .eq('id', list.id)

    setLoading(false)
  }

  const handleClaimItem = async (item: Item) => {
    if (item.claimed_at) {
      // Show unclaim confirmation
      setItemToUnclaim(item)
      setShowUnclaimConfirm(true)
    } else {
      // Show name input dialog
      setItemToClaim(item)
      setShowNameInput(true)
    }
  }

  const confirmUnclaim = async () => {
    if (!itemToUnclaim) return

    setClaimingId(itemToUnclaim.id)
    const { error } = await supabase
      .from('items')
      // @ts-expect-error - Type inference issue with Supabase client
      .update({
        claimed_at: null,
        claimed_by: null
      })
      .eq('id', itemToUnclaim.id)

    if (error) {
      console.error('Error unclaiming item:', error)
      setToastMessage('Failed to unclaim item. Please try again.')
      setToastType('error')
      setShowToast(true)
    } else {
      setItems(items.map(i => i.id === itemToUnclaim.id ? { ...i, claimed_at: undefined, claimed_by: undefined } as Item : i))
    }
    setClaimingId(null)
    setItemToUnclaim(null)
  }

  const confirmClaim = async (claimerName: string) => {
    if (!itemToClaim) return

    setClaimingId(itemToClaim.id)
    const { error } = await supabase
      .from('items')
      // @ts-expect-error - Type inference issue with Supabase client
      .update({
        claimed_at: new Date().toISOString(),
        claimed_by: claimerName.trim() || 'Someone'
      })
      .eq('id', itemToClaim.id)

    if (error) {
      console.error('Error claiming item:', error)
      setToastMessage('Failed to claim item. Please try again.')
      setToastType('error')
      setShowToast(true)
    } else {
      setItems(items.map(i => i.id === itemToClaim.id ? {
        ...i,
        claimed_at: new Date().toISOString(),
        claimed_by: claimerName.trim() || 'Someone'
      } : i))
    }
    setClaimingId(null)
    setItemToClaim(null)
  }

  const handleItemClick = async (item: Item) => {
    // Increment click count
    await supabase
      .from('items')
      // @ts-expect-error - Type inference issue with Supabase client
      .update({ click_count: (item.click_count || 0) + 1 })
      .eq('id', item.id)

    // Open link
    window.open(item.formatted_url || item.url || '#', '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!list) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">List not found</h1>
          <p className="text-gray-600 mb-6">This list doesn't exist or has been deleted.</p>
          <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Go to homepage
          </Link>
        </div>
      </div>
    )
  }

  if (isOwnList) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">👀</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">No peeking!</h1>
          <p className="text-gray-600 mb-6">
            You can't view your own list because it shows which gifts have been claimed. That would ruin the surprise! 🎁
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">♥</span>
            </div>
            <span className="text-xl font-bold text-gray-900">clearly.gift</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{list.name}</h1>
            <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {list.view_count || 0} view{(list.view_count || 0) !== 1 ? 's' : ''}
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Click "Claim Gift" to let others know you're getting this item. 🎁
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-600 text-lg">This list is empty right now.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all duration-300 ${
                  item.claimed_at 
                    ? 'border-gray-200 bg-gray-50 shadow-sm' 
                    : 'border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {item.claimed_at && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center animate-checkmark">
                            <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                            Claimed by {item.claimed_by}
                          </span>
                        </div>
                      )}
                      <h3 className={`text-lg font-semibold mb-2 transition-colors ${
                        item.claimed_at ? 'text-gray-500' : 'text-gray-900'
                      }`}>
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className={`text-sm mb-3 leading-relaxed ${
                          item.claimed_at ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {item.description}
                        </p>
                      )}
                      {item.click_count && !item.claimed_at && (
                        <div className="text-xs text-gray-500">
                          {item.click_count} click{item.click_count !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex flex-col gap-2 flex-shrink-0">
                      {item.url && !item.claimed_at && (
                        <button
                          onClick={() => handleItemClick(item)}
                          className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-950 text-sm font-medium whitespace-nowrap transition-all active:scale-95 shadow-sm hover:shadow-md"
                        >
                          View Item
                        </button>
                      )}
                      {item.claimed_at ? (
                        <button
                          onClick={() => handleClaimItem(item)}
                          disabled={claimingId === item.id}
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm font-medium disabled:opacity-50 whitespace-nowrap transition-all disabled:cursor-not-allowed"
                        >
                          {claimingId === item.id ? 'Updating...' : 'Unclaim'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleClaimItem(item)}
                          disabled={claimingId === item.id}
                          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm font-medium disabled:opacity-50 whitespace-nowrap transition-all active:scale-95 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                        >
                          {claimingId === item.id ? 'Claiming...' : 'Claim Gift'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={showUnclaimConfirm}
        onClose={() => {
          setShowUnclaimConfirm(false)
          setItemToUnclaim(null)
        }}
        onConfirm={confirmUnclaim}
        title="Unclaim Gift"
        message="Are you sure you want to unclaim this gift? If you weren't the one who claimed it, unclaiming could result in duplicate gifts being purchased."
        confirmText="Unclaim"
        isDangerous={true}
      />
      <InputDialog
        isOpen={showNameInput}
        onClose={() => {
          setShowNameInput(false)
          setItemToClaim(null)
        }}
        onSubmit={confirmClaim}
        title="Claim Gift"
        message="Enter your name so others know you're getting this gift:"
        placeholder="Your name (optional)"
        submitText="Claim Gift"
      />
      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        type={toastType}
      />
    </div>
  )
}
