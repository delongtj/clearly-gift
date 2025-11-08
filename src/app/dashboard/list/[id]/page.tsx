'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { processUrl } from '@/utils/url-processor'
import type { List, Item } from '@/types/database'
import ConfirmDialog from '@/components/ConfirmDialog'
import Toast from '@/components/Toast'

export default function EditListPage() {
  const router = useRouter()
  const params = useParams()
  const listId = params.id as string

  const [list, setList] = useState<List | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Add item form state
  const [newItemName, setNewItemName] = useState('')
  const [newItemDescription, setNewItemDescription] = useState('')
  const [newItemUrl, setNewItemUrl] = useState('')

  // Edit item form state
  const [editItemName, setEditItemName] = useState('')
  const [editItemDescription, setEditItemDescription] = useState('')
  const [editItemUrl, setEditItemUrl] = useState('')

  // Dialog states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success')

  useEffect(() => {
    checkAuth()
    loadListAndItems()
  }, [listId])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth')
    }
  }

  const loadListAndItems = async () => {
    setLoading(true)

    // Load list
    const { data: listData, error: listError } = await supabase
      .from('lists')
      .select('*')
      .eq('id', listId)
      .single()

    if (listError || !listData) {
      console.error('Error loading list:', listError)
      router.push('/dashboard')
      return
    }

    setList(listData as List)

    // Load items
    const { data: itemsData, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .eq('list_id', listId)
      .order('created_at', { ascending: true })

    if (itemsError) {
      console.error('Error loading items:', itemsError)
    } else {
      setItems((itemsData as Item[]) || [])
    }

    setLoading(false)
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemName.trim() || saving) return

    setSaving(true)
    // Normalize URL by adding https:// if missing protocol
    let normalizedUrl = newItemUrl.trim()
    if (normalizedUrl && !normalizedUrl.match(/^https?:\/\//i)) {
      normalizedUrl = `https://${normalizedUrl}`
    }
    const formattedUrl = normalizedUrl ? processUrl(normalizedUrl) : undefined

    const { data, error } = await supabase
      .from('items')
      // @ts-expect-error - Type inference issue with Supabase client
      .insert({
        list_id: listId,
        name: newItemName.trim(),
        description: newItemDescription.trim() || null,
        url: normalizedUrl || null,
        formatted_url: formattedUrl
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating item:', error)
      setToastMessage('Failed to create item. Please try again.')
      setToastType('error')
      setShowToast(true)
    } else {
      setItems([...items, data as Item])
      setNewItemName('')
      setNewItemDescription('')
      setNewItemUrl('')
      setShowAddForm(false)
    }
    setSaving(false)
  }

  const handleEditItem = async (itemId: string) => {
    if (!editItemName.trim() || saving) return

    setSaving(true)
    // Normalize URL by adding https:// if missing protocol
    let normalizedUrl = editItemUrl.trim()
    if (normalizedUrl && !normalizedUrl.match(/^https?:\/\//i)) {
      normalizedUrl = `https://${normalizedUrl}`
    }
    const formattedUrl = normalizedUrl ? processUrl(normalizedUrl) : undefined

    const { error } = await supabase
      .from('items')
      // @ts-expect-error - Type inference issue with Supabase client
      .update({
        name: editItemName.trim(),
        description: editItemDescription.trim() || null,
        url: normalizedUrl || null,
        formatted_url: formattedUrl
      })
      .eq('id', itemId)

    if (error) {
      console.error('Error updating item:', error)
      setToastMessage('Failed to update item. Please try again.')
      setToastType('error')
      setShowToast(true)
    } else {
      setItems(items.map(i => i.id === itemId ? {
        ...i,
        name: editItemName.trim(),
        description: editItemDescription.trim() || undefined,
        url: normalizedUrl || undefined,
        formatted_url: formattedUrl
      } as Item : i))
      cancelEditing()
    }
    setSaving(false)
  }

  const handleDeleteItem = (item: Item) => {
    setItemToDelete(item)
    setShowDeleteConfirm(true)
    setOpenDropdownId(null)
  }

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return

    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemToDelete.id)

    if (error) {
      console.error('Error deleting item:', error)
      setToastMessage('Failed to delete item. Please try again.')
      setToastType('error')
      setShowToast(true)
    } else {
      setItems(items.filter(i => i.id !== itemToDelete.id))
    }
    setItemToDelete(null)
  }

  const toggleDropdown = (itemId: string) => {
    setOpenDropdownId(openDropdownId === itemId ? null : itemId)
  }

  const startEditing = (item: Item) => {
    setEditingItemId(item.id)
    setEditItemName(item.name)
    setEditItemDescription(item.description || '')
    setEditItemUrl(item.url || '')
  }

  const cancelEditing = () => {
    setEditingItemId(null)
    setEditItemName('')
    setEditItemDescription('')
    setEditItemUrl('')
  }

  const copyShareLink = () => {
    if (!list) return
    const url = `${window.location.origin}/list/${list.token}`
    navigator.clipboard.writeText(url)
    setToastMessage('Share link copied to clipboard!')
    setToastType('success')
    setShowToast(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!list) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">clearly.gift</span>
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              ← Back to Lists
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{list.name}</h1>
            <button
              onClick={copyShareLink}
              className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Copy Share Link
            </button>
          </div>
          <p className="text-gray-600 text-sm">
            Add and manage items for this list
          </p>
        </div>

        {/* Add Item Button */}
        {!showAddForm && items.length > 0 && (
          <button
            onClick={() => setShowAddForm(true)}
            className="mb-6 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700"
          >
            + Add Item
          </button>
        )}

        {/* Inline Add Form */}
        {showAddForm && (
          <form onSubmit={handleAddItem} className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Item</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  id="itemName"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g., Wireless Headphones"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  autoFocus
                  disabled={saving}
                  required
                />
              </div>
              <div>
                <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  id="itemDescription"
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  placeholder="Add details about this item..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  disabled={saving}
                />
              </div>
              <div>
                <label htmlFor="itemUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Link (optional)
                </label>
                <input
                  type="text"
                  id="itemUrl"
                  value={newItemUrl}
                  onChange={(e) => setNewItemUrl(e.target.value)}
                  placeholder="amazon.com/product or https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  disabled={saving}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving || !newItemName.trim()}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {saving ? 'Adding...' : 'Add Item'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setNewItemName('')
                    setNewItemDescription('')
                    setNewItemUrl('')
                  }}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Items List */}
        {items.length === 0 && !showAddForm ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No items yet</h2>
            <p className="text-gray-600 mb-4">
              Add your first item to get started
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-6">
                {editingItemId === item.id ? (
                  // Inline Edit Mode
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item Name *
                      </label>
                      <input
                        type="text"
                        value={editItemName}
                        onChange={(e) => setEditItemName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                        autoFocus
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={editItemDescription}
                        onChange={(e) => setEditItemDescription(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Link
                      </label>
                      <input
                        type="text"
                        value={editItemUrl}
                        onChange={(e) => setEditItemUrl(e.target.value)}
                        placeholder="amazon.com/product or https://..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                        disabled={saving}
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleEditItem(item.id)}
                        disabled={saving || !editItemName.trim()}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm font-medium"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={saving}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Normal Display Mode
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                      {item.description && (
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                      )}
                      {item.url && (
                        <a
                          href={item.formatted_url || item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-900 hover:text-blue-950 text-sm inline-flex items-center gap-1"
                        >
                          View item
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                    <div className="relative ml-4">
                      <button
                        onClick={() => toggleDropdown(item.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="More actions"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      {openDropdownId === item.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenDropdownId(null)}
                          />
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                            <button
                              onClick={() => {
                                startEditing(item)
                                setOpenDropdownId(null)
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit Item
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete Item
                            </button>
                          </div>
                        </>
                      )}
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
        onConfirm={confirmDeleteItem}
        title="Delete Item"
        message={`Are you sure you want to delete "${itemToDelete?.name}"?`}
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
