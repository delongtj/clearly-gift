'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { generateListToken } from '@/utils/url-processor'
import type { List } from '@/types/database'

export default function Dashboard() {
  const router = useRouter()
  const [lists, setLists] = useState<List[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingListId, setEditingListId] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [newListName, setNewListName] = useState('')
  const [editListName, setEditListName] = useState('')
  const [saving, setSaving] = useState(false)

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
      setLists((data as List[]) || [])
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

  const handleDeleteList = async (list: List) => {
    if (!confirm(`Are you sure you want to delete "${list.name}"? This will also delete all items in this list.`)) {
      return
    }

    const { error } = await supabase
      .from('lists')
      .delete()
      .eq('id', list.id)

    if (error) {
      console.error('Error deleting list:', error)
      alert('Failed to delete list. Please try again.')
    } else {
      setLists(lists.filter(l => l.id !== list.id))
    }
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
    alert('Share link copied to clipboard!')
    setOpenDropdownId(null)
  }

  const toggleDropdown = (listId: string) => {
    setOpenDropdownId(openDropdownId === listId ? null : listId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">clearly.gift</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Your Lists</h1>
            {lists.length > 0 && !showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                Create New List
              </button>
            )}
          </div>

          {/* Inline Create Form */}
          {showCreateForm && (
            <form onSubmit={handleCreateList} className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="List name (e.g., Birthday Wishlist 2025)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  autoFocus
                  disabled={saving}
                />
                <button
                  type="submit"
                  disabled={saving || !newListName.trim()}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600">Loading your lists...</p>
          </div>
        ) : lists.length === 0 && !showCreateForm ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Create your first list</h2>
            <p className="text-gray-600 mb-6">
              Share your wishlist, keep the surprise
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
            >
              Create Your First List
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {lists.map(list => (
              <div key={list.id} className="bg-white rounded-lg border border-gray-200 p-6">
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
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">{list.name}</h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{list.view_count || 0} views</span>
                        <span>•</span>
                        <span>Created {new Date(list.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Link
                        href={`/list/${list.token}`}
                        className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        View List
                      </Link>
                      <button
                        onClick={() => copyShareLink(list.token)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Share
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
                                Edit Name
                              </button>
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
    </div>
  )
}
