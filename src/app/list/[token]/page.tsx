'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { List, Item } from '@/types/database'
import InputDialog from '@/components/InputDialog'
import Toast from '@/components/Toast'

export default function PublicListPage() {
  const params = useParams()
  const token = params.token as string

  const [list, setList] = useState<List | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [claimingId, setClaimingId] = useState<string | null>(null)

  // Dialog states
  const [showNameInput, setShowNameInput] = useState(false)
  const [itemToClaim, setItemToClaim] = useState<Item | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success')

  useEffect(() => {
    loadList()
  }, [token])

  const loadList = async () => {
    setLoading(true)

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
      // Unclaim
      setClaimingId(item.id)
      const { error } = await supabase
        .from('items')
        // @ts-expect-error - Type inference issue with Supabase client
        .update({
          claimed_at: null,
          claimed_by: null
        })
        .eq('id', item.id)

      if (error) {
        console.error('Error unclaiming item:', error)
        setToastMessage('Failed to unclaim item. Please try again.')
        setToastType('error')
        setShowToast(true)
      } else {
        setItems(items.map(i => i.id === item.id ? { ...i, claimed_at: undefined, claimed_by: undefined } as Item : i))
      }
      setClaimingId(null)
    } else {
      // Show name input dialog
      setItemToClaim(item)
      setShowNameInput(true)
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">clearly.gift</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{list.name}</h1>
            <div className="text-sm text-gray-500">
              <span>{list.view_count || 0} views</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Click "Claim Gift" to let others know you're getting this item
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600">No items in this list yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg border border-gray-200 p-6 transition-opacity ${
                  item.claimed_at ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`text-lg font-medium mb-2 ${
                      item.claimed_at ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className={`text-sm mb-3 ${
                        item.claimed_at ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {item.claimed_at && (
                        <span>Claimed by {item.claimed_by}</span>
                      )}
                      {item.click_count ? (
                        <span>{item.click_count} click{item.click_count !== 1 ? 's' : ''}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col space-y-2">
                    {item.url && !item.claimed_at && (
                      <button
                        onClick={() => handleItemClick(item)}
                        className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-950 text-center text-sm font-medium whitespace-nowrap"
                      >
                        View Item
                      </button>
                    )}
                    {item.claimed_at ? (
                      <button
                        onClick={() => handleClaimItem(item)}
                        disabled={claimingId === item.id}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm font-medium disabled:opacity-50 whitespace-nowrap"
                      >
                        {claimingId === item.id ? 'Updating...' : 'Unclaim'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleClaimItem(item)}
                        disabled={claimingId === item.id}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm font-medium disabled:opacity-50 whitespace-nowrap"
                      >
                        {claimingId === item.id ? 'Claiming...' : 'Claim Gift'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Dialogs */}
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
