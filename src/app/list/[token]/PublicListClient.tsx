'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { db } from '@/lib/database'
import type { List, Item } from '@/types/database'
import PublicHeader from '@/components/PublicHeader'
import ConfirmDialog from '@/components/ConfirmDialog'
import InputDialog from '@/components/InputDialog'
import SubscriptionDialog from '@/components/SubscriptionDialog'
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
  const [user, setUser] = useState<boolean | null>(null)

  // Dialog states
  const [showNameInput, setShowNameInput] = useState(false)
  const [itemToClaim, setItemToClaim] = useState<Item | null>(null)
  const [showUnclaimConfirm, setShowUnclaimConfirm] = useState(false)
  const [itemToUnclaim, setItemToUnclaim] = useState<Item | null>(null)
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success')

  useEffect(() => {
    loadList()
  }, [token])

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(!!data.user)
    }
    checkAuth()
  }, [])

  // Subscribe to real-time changes
  useEffect(() => {
    // Only subscribe if we have a list ID and it's not the user's own list
    if (!list?.id || isOwnList) return

    // Subscribe to realtime changes on items for this list
    const channel = supabase
      .channel(`list-${list.id}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'items',
          filter: `list_id=eq.${list.id}`
        },
        (payload) => {
          console.log('Item change received:', payload)

          if (payload.eventType === 'INSERT') {
            // New item added
            setItems(prev => [...prev, payload.new as Item].sort((a, b) => a.position - b.position))
          } else if (payload.eventType === 'UPDATE') {
            // Item updated (claimed/unclaimed, edited, or reordered)
            setItems(prev => prev.map(item =>
              item.id === payload.new.id ? payload.new as Item : item
            ).sort((a, b) => a.position - b.position))
          } else if (payload.eventType === 'DELETE') {
            // Item removed
            setItems(prev => prev.filter(item => item.id !== payload.old.id))
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'lists',
          filter: `id=eq.${list.id}`
        },
        (payload) => {
          console.log('List change received:', payload)
          // Update list data (view count, name, etc.)
          setList(payload.new as List)
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Connected to realtime updates')
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Realtime connection error:', err)
        }
        if (status === 'TIMED_OUT') {
          console.warn('Realtime connection timed out')
        }
      })

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [list?.id, isOwnList])

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
      .order('position', { ascending: true })

    if (itemsError) {
      console.error('Error loading items:', itemsError)
    } else {
      setItems((itemsData as Item[]) || [])
    }

    // Increment view count
    try {
      // @ts-expect-error - Supabase RPC type definitions
      await supabase.rpc('increment_list_view_count', { list_id: list.id })
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }

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
  const success = await db.unclaimItem(itemToUnclaim.id)

  if (!success) {
  console.error('Error unclaiming item')
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
  const success = await db.claimItem(itemToClaim.id, claimerName.trim() || 'Someone')

  if (!success) {
  console.error('Error claiming item')
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

  const handleItemClick = (item: Item) => {
  // Open link immediately
  window.open(item.formatted_url || item.url || '#', '_blank')
  
  // Increment click count in background
  Promise.resolve(supabase.rpc('increment_item_click_count', { item_id: item.id } as any)).then(() => {
  console.log('Click count incremented for item:', item.id)
  }).catch((error: any) => {
  console.error('Error incrementing click count:', error)
  })
   }

  if (loading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center flex-1">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!list) {
    return (
      <div className="bg-gray-50 flex items-center justify-center flex-1">
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
      <div className="bg-gray-50 flex items-center justify-center flex-1">
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
   <div className="bg-gradient-to-br from-gray-50 to-gray-100">
     <PublicHeader />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h1 className="text-3xl font-bold text-gray-900">{list.name}</h1>
        <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
        {list.view_count || 0} view{(list.view_count || 0) !== 1 ? 's' : ''}
        </div>
        <button
        onClick={() => setShowSubscriptionDialog(true)}
        className="text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 rounded-full transition-colors whitespace-nowrap"
        >
        Subscribe to Changes
        </button>
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
                      {item.url && item.click_count != null && !item.claimed_at && (
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

        {!user && (
         <section className="max-w-4xl mx-auto px-4 py-12">
           <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
             <h2 className="text-2xl font-bold text-gray-900 mb-3">Create your own wish list</h2>
             <p className="text-gray-600 mb-6 max-w-md mx-auto">
               Share your own wish list with family and friends. It's free and takes just a minute to get started.
             </p>
             <Link href="/auth" className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 font-medium shadow-sm hover:shadow-md transition-all active:scale-95">
               Create Your List
             </Link>
           </div>
         </section>
       )}

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
      <SubscriptionDialog
        isOpen={showSubscriptionDialog}
        onClose={() => setShowSubscriptionDialog(false)}
        listId={list?.id || ''}
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
