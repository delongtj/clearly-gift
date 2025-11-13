'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { generateListToken } from '@/utils/url-processor'
import type { List } from '@/types/database'
import ConfirmDialog from '@/components/ConfirmDialog'
import Toast from '@/components/Toast'

export default function Dashboard() {
  const router = useRouter()
  const [lists, setLists] = useState<List[]>([])
  const [listClickCounts, setListClickCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingListId, setEditingListId] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [newListName, setNewListName] = useState('')
  const [editListName, setEditListName] = useState('')
  const [saving, setSaving] = useState(false)

  // Dialog states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [listToDelete, setListToDelete] = useState<List | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success')

  // Check auth and load lists
  useEffect(() => {
    checkAuth()
    loadLists()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.push('/auth')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  // Subscribe to real-time changes for all user's lists
  useEffect(() => {
    if (lists.length === 0) return

    const channels = lists.map(list => {
      const channel = supabase
        .channel(`list-${list.id}-dashboard`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'lists',
            filter: `id=eq.${list.id}`
          },
          (payload) => {
            console.log('List update received:', payload)
            // Update list data (view count, name, etc.)
            setLists(prev => prev.map(l => 
              l.id === list.id ? payload.new as List : l
            ))
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'items',
            filter: `list_id=eq.${list.id}`
          },
          async (payload) => {
            console.log('Item update received:', payload)
            // Recalculate click counts when items are updated
            if (payload.new.click_count !== undefined) {
              const { data: itemsData } = await supabase
                .from('items')
                .select('click_count')
                .eq('list_id', list.id)

              if (itemsData) {
                setListClickCounts(prev => ({
                  ...prev,
                  [list.id]: itemsData.reduce((sum, item) => sum + (item.click_count || 0), 0)
                }))
              }
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`Connected to real-time updates for list ${list.id}`)
          }
        })

      return channel
    })

    // Cleanup subscriptions on unmount
    return () => {
      channels.forEach(channel => supabase.removeChannel(channel))
    }
  }, [lists])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth')
    }
  }

  const loadLists = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading lists:', error)
      setLists([])
    } else {
      const loadedLists = (data as List[]) || []
      setLists(loadedLists)
      
      // Load click counts for all lists
      const clickCounts: Record<string, number> = {}
      for (const list of loadedLists) {
      const { data: itemsData } = await supabase
      .from('items')
      .select('click_count')
      .eq('list_id', list.id)
      
      if (itemsData) {
      clickCounts[list.id] = (itemsData as { click_count: number }[]).reduce((sum, item) => sum + (item.click_count || 0), 0)
      }
      }
      setListClickCounts(clickCounts)
    }
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newListName.trim() || saving) return

    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setSaving(false)
      return
    }

    const token = generateListToken()
    const { data, error } = await supabase
      .from('lists')
      // @ts-expect-error - Type inference issue with Supabase client
      .insert({
        user_id: user.id,
        name: newListName.trim(),
        token
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating list:', error)
      alert('Failed to create list. Please try again.')
    } else {
      setLists([data as List, ...lists])
      setListClickCounts(prev => ({ ...prev, [(data as List).id]: 0 }))
      setNewListName('')
      setShowCreateForm(false)
    }
    setSaving(false)
  }

  const handleEditList = async (listId: string) => {
    if (!editListName.trim() || saving) return

    setSaving(true)
    const { error } = await supabase
      .from('lists')
      // @ts-expect-error - Type inference issue with Supabase client
      .update({ name: editListName.trim() })
      .eq('id', listId)

    if (error) {
      console.error('Error updating list:', error)
      alert('Failed to update list. Please try again.')
    } else {
      setLists(lists.map(l => l.id === listId ? { ...l, name: editListName.trim() } : l))
      setEditingListId(null)
      setEditListName('')
    }
    setSaving(false)
  }

  const handleDeleteList = (list: List) => {
    setListToDelete(list)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteList = async () => {
    if (!listToDelete) return

    const { error } = await supabase
      .from('lists')
      .delete()
      .eq('id', listToDelete.id)

    if (error) {
      console.error('Error deleting list:', error)
      setToastMessage('Failed to delete list. Please try again.')
      setToastType('error')
      setShowToast(true)
    } else {
      setLists(lists.filter(l => l.id !== listToDelete.id))
      setListClickCounts(prev => {
        const newCounts = { ...prev }
        delete newCounts[listToDelete.id]
        return newCounts
      })
    }
    setListToDelete(null)
  }

  const startEditing = (list: List) => {
    setEditingListId(list.id)
    setEditListName(list.name)
  }

  const cancelEditing = () => {
    setEditingListId(null)
    setEditListName('')
  }

  const copyShareLink = (token: string) => {
    const url = `${window.location.origin}/list/${token}`
    navigator.clipboard.writeText(url)
    setToastMessage('Share link copied to clipboard!')
    setToastType('success')
    setShowToast(true)
    setOpenDropdownId(null)
  }

  const toggleDropdown = (listId: string) => {
    setOpenDropdownId(openDropdownId === listId ? null : listId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">♥</span>
              </div>
              <span className="text-xl font-bold text-gray-900">clearly.gift</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Your Lists</h1>
              <p className="text-gray-600 mt-1">Manage and share your wish lists</p>
            </div>
            {lists.length > 0 && !showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 w-full md:w-auto"
              >
                Create New List
              </button>
            )}
          </div>

          {/* Inline Create Form */}
          {showCreateForm && (
          <form onSubmit={handleCreateList} className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm animate-slide-in">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create a New List</h3>
          <div className="flex flex-col md:flex-row md:items-center gap-3">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="List name (e.g., Birthday Wishlist 2025)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white transition-all"
                  autoFocus
                  disabled={saving}
                />
                <button
                  type="submit"
                  disabled={saving || !newListName.trim()}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all active:scale-95 shadow-sm"
                >
                  {saving ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    setNewListName('')
                  }}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <div className="inline-block animate-spin">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <p className="text-gray-600 mt-4">Loading your lists...</p>
          </div>
        ) : lists.length === 0 && !showCreateForm ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <div className="text-5xl mb-4">🎁</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Create your first list</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Share your wishlist, keep the surprise
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              Create Your First List
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {lists.map(list => (
              <div key={list.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all hover:border-emerald-200">
                {editingListId === list.id ? (
                  // Inline Edit Mode
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={editListName}
                      onChange={(e) => setEditListName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                      autoFocus
                      disabled={saving}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleEditList(list.id)
                        } else if (e.key === 'Escape') {
                          cancelEditing()
                        }
                      }}
                    />
                    <button
                      onClick={() => handleEditList(list.id)}
                      disabled={saving || !editListName.trim()}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEditing}
                      disabled={saving}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  // Normal Display Mode
                  <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                  <Link href={`/dashboard/list/${list.id}`}>
                         <h2 className="text-lg font-semibold text-gray-900 mb-3 hover:text-emerald-600 hover:underline cursor-pointer transition-colors">{list.name}</h2>
                       </Link>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{list.view_count || 0} views</span>
                      <span>{listClickCounts[list.id] || 0} link clicks</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <button
                        onClick={() => copyShareLink(list.token)}
                        className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-all active:scale-95 shadow-sm hover:shadow-md"
                      >
                        Copy Share Link
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(list.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          aria-label="More actions"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        {openDropdownId === list.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenDropdownId(null)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                              <Link
                                href={`/dashboard/list/${list.id}`}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                onClick={() => setOpenDropdownId(null)}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                Edit Items
                              </Link>
                              <button
                                onClick={() => {
                                  startEditing(list)
                                  setOpenDropdownId(null)
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Rename List
                              </button>
                              <div className="border-t border-gray-100 my-1" />
                              <button
                                onClick={() => {
                                  handleDeleteList(list)
                                  setOpenDropdownId(null)
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete List
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteList}
        title="Delete List"
        message={`Are you sure you want to delete "${listToDelete?.name}"? This will also delete all items in this list.`}
        confirmText="Delete"
        isDangerous={true}
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
