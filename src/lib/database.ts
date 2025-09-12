import { createClient } from '@/lib/auth'
import { processUrl, generateListToken } from '@/utils/url-processor'
import type { List, Item, User } from '@/types/database'

export class DatabaseService {
  private supabase = createClient()

  // User operations
  async getCurrentUser(): Promise<User | null> {
    const supabase = await this.supabase
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    return data
  }

  // List operations
  async createList(name: string): Promise<List | null> {
    const supabase = await this.supabase
    const user = await this.getCurrentUser()
    if (!user) return null

    const token = generateListToken()

    const { data, error } = await supabase
      .from('lists')
      .insert({
        user_id: user.id,
        name,
        token
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating list:', error)
      return null
    }

    return data
  }

  async getUserLists(): Promise<List[]> {
    const supabase = await this.supabase
    const user = await this.getCurrentUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user lists:', error)
      return []
    }

    return data || []
  }

  async getListByToken(token: string): Promise<(List & { items: Item[] }) | null> {
    const supabase = await this.supabase
    
    const { data: list, error: listError } = await supabase
      .from('lists')
      .select('*')
      .eq('token', token)
      .single()

    if (listError || !list) {
      console.error('Error fetching list:', listError)
      return null
    }

    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .eq('list_id', list.id)
      .order('created_at', { ascending: true })

    if (itemsError) {
      console.error('Error fetching items:', itemsError)
      return null
    }

    // Increment view count
    await supabase
      .from('lists')
      .update({ view_count: (list.view_count || 0) + 1 })
      .eq('id', list.id)

    return {
      ...list,
      items: items || []
    }
  }

  async updateList(id: string, updates: Partial<Pick<List, 'name'>>): Promise<boolean> {
    const supabase = await this.supabase
    
    const { error } = await supabase
      .from('lists')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Error updating list:', error)
      return false
    }

    return true
  }

  async deleteList(id: string): Promise<boolean> {
    const supabase = await this.supabase
    
    const { error } = await supabase
      .from('lists')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting list:', error)
      return false
    }

    return true
  }

  // Item operations
  async createItem(
    listId: string,
    name: string,
    description?: string,
    url?: string
  ): Promise<Item | null> {
    const supabase = await this.supabase
    
    const formattedUrl = url ? processUrl(url) : undefined

    const { data, error } = await supabase
      .from('items')
      .insert({
        list_id: listId,
        name,
        description,
        url,
        formatted_url: formattedUrl
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating item:', error)
      return null
    }

    return data
  }

  async updateItem(
    id: string,
    updates: Partial<Pick<Item, 'name' | 'description' | 'url'>>
  ): Promise<boolean> {
    const supabase = await this.supabase
    
    // Process URL if it's being updated
    if (updates.url !== undefined) {
      updates = {
        ...updates,
        formatted_url: updates.url ? processUrl(updates.url) : null
      }
    }

    const { error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Error updating item:', error)
      return false
    }

    return true
  }

  async claimItem(id: string, claimedBy?: string): Promise<boolean> {
    const supabase = await this.supabase
    
    const { error } = await supabase
      .from('items')
      .update({
        claimed_at: new Date().toISOString(),
        claimed_by: claimedBy || 'Anonymous'
      })
      .eq('id', id)
      .is('claimed_at', null) // Only claim if not already claimed

    if (error) {
      console.error('Error claiming item:', error)
      return false
    }

    return true
  }

  async unclaimItem(id: string): Promise<boolean> {
    const supabase = await this.supabase
    
    const { error } = await supabase
      .from('items')
      .update({
        claimed_at: null,
        claimed_by: null
      })
      .eq('id', id)

    if (error) {
      console.error('Error unclaiming item:', error)
      return false
    }

    return true
  }

  async incrementClickCount(id: string): Promise<boolean> {
    const supabase = await this.supabase
    
    // Get current count first
    const { data: item } = await supabase
      .from('items')
      .select('click_count')
      .eq('id', id)
      .single()

    if (!item) return false

    const { error } = await supabase
      .from('items')
      .update({ click_count: (item.click_count || 0) + 1 })
      .eq('id', id)

    if (error) {
      console.error('Error incrementing click count:', error)
      return false
    }

    return true
  }

  async deleteItem(id: string): Promise<boolean> {
    const supabase = await this.supabase
    
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting item:', error)
      return false
    }

    return true
  }
}

export const db = new DatabaseService()