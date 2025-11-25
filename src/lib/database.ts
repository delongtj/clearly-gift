import { createClient as createBrowserClient } from '@supabase/supabase-js'
import { processUrl, generateListToken } from '@/utils/url-processor'
import { 
  trackItemAdded, 
  trackItemRemoved, 
  trackItemClaimed, 
  trackItemUnclaimed,
  trackItemUpdated
} from '@/lib/subscriptions'
import type { List, Item, User, Database } from '@/types/database'

export class DatabaseService {
  private supabase: any

  constructor(supabaseClient?: any) {
    if (supabaseClient) {
      this.supabase = supabaseClient
    } else {
      this.supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    }
  }

  // User operations
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) return null

    const { data } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    return data as User | null
  }

  // List operations
  async createList(name: string): Promise<List | null> {
    const user = await this.getCurrentUser()
    if (!user) return null

    const token = generateListToken()

    const { data, error } = await this.supabase
      .from('lists')
      // @ts-ignore - Type inference issue with Supabase client
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

    return data as List
  }

  async getUserLists(): Promise<List[]> {
    const user = await this.getCurrentUser()
    if (!user) return []

    const { data, error } = await this.supabase
      .from('lists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user lists:', error)
      return []
    }

    return (data as List[]) || []
  }

  async getListByToken(token: string): Promise<(List & { items: Item[] }) | null> {
    const { data: list, error: listError } = await this.supabase
      .from('lists')
      .select('*')
      .eq('token', token)
      .single()

    if (listError || !list) {
      console.error('Error fetching list:', listError)
      return null
    }

    const typedList = list as List

    const { data: items, error: itemsError } = await this.supabase
      .from('items')
      .select('*')
      .eq('list_id', typedList.id)
      .order('created_at', { ascending: true })

    if (itemsError) {
      console.error('Error fetching items:', itemsError)
      return null
    }

    // Increment view count
    await this.supabase
      .from('lists')
      // @ts-ignore - Type inference issue with Supabase client
      .update({ view_count: (typedList.view_count || 0) + 1 })
      .eq('id', typedList.id)

    return {
      ...typedList,
      items: (items as Item[]) || []
    }
  }

  async updateList(id: string, updates: Partial<Pick<List, 'name'>>): Promise<boolean> {
    const { error } = await this.supabase
      .from('lists')
      // @ts-ignore - Type inference issue with Supabase client
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Error updating list:', error)
      return false
    }

    return true
  }

  async deleteList(id: string): Promise<boolean> {
    const { error } = await this.supabase
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
    // URL is already processed by the server action before this is called
    const formattedUrl = url || undefined

    const { data, error } = await this.supabase
      .from('items')
      // @ts-ignore - Type inference issue with Supabase client
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
      console.error('[DATABASE] Error creating item:', error)
      return null
    }

    // Track subscription event
    const typedData = data as Item
    await trackItemAdded(listId, typedData.id, name)

    return typedData
  }

  async updateItem(
    id: string,
    updates: Partial<Pick<Item, 'name' | 'description' | 'url'>>
  ): Promise<boolean> {
    // Get item info before updating (for tracking)
    const { data: item } = await this.supabase
      .from('items')
      .select('list_id, name')
      .eq('id', id)
      .single()

    // URL is already processed by the server action before this is called
    let finalUpdates: any = { ...updates }
    if (updates.url !== undefined) {
      finalUpdates.formatted_url = updates.url || null
    }

    const { error } = await this.supabase
      .from('items')
      // @ts-ignore - Type inference issue with Supabase client
      .update(finalUpdates)
      .eq('id', id)

    if (error) {
      console.error('[DATABASE] Error updating item:', error)
      return false
    }

    // Track subscription event only if user made meaningful changes
    const typedItem = item as { list_id: string; name: string } | null
    if (typedItem && (updates.name || updates.description || updates.url)) {
      await trackItemUpdated(typedItem.list_id, id, typedItem.name, updates)
    }

    return true
  }

  async claimItem(id: string, claimedBy?: string): Promise<boolean> {
    // Get item info before updating (for tracking)
    const { data: item } = await this.supabase
      .from('items')
      .select('list_id, name, claimed_at')
      .eq('id', id)
      .single()

    const { error } = await this.supabase
      .from('items')
      // @ts-ignore - Type inference issue with Supabase client
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

    // Track subscription event if item wasn't already claimed
    const typedItem = item as { list_id: string; name: string; claimed_at: string | null } | null
    if (typedItem && !typedItem.claimed_at) {
      await trackItemClaimed(typedItem.list_id, id, typedItem.name, claimedBy || 'Anonymous')
    }

    return true
  }

  async unclaimItem(id: string): Promise<boolean> {
    // Get item info before updating (for tracking)
    const { data: item } = await this.supabase
      .from('items')
      .select('list_id, name, claimed_at')
      .eq('id', id)
      .single()

    const { error } = await this.supabase
      .from('items')
      // @ts-ignore - Type inference issue with Supabase client
      .update({
        claimed_at: null,
        claimed_by: null
      })
      .eq('id', id)

    if (error) {
      console.error('Error unclaiming item:', error)
      return false
    }

    // Track subscription event if item was claimed
    const typedItem = item as { list_id: string; name: string; claimed_at: string | null } | null
    if (typedItem && typedItem.claimed_at) {
      await trackItemUnclaimed(typedItem.list_id, id, typedItem.name)
    }

    return true
  }

  async incrementClickCount(id: string): Promise<boolean> {
    // Get current count first
    const { data: item } = await this.supabase
      .from('items')
      .select('click_count')
      .eq('id', id)
      .single()

    if (!item) return false

    const { error } = await this.supabase
      .from('items')
      // @ts-ignore - Type inference issue with Supabase client
      .update({ click_count: (item.click_count || 0) + 1 })
      .eq('id', id)

    if (error) {
      console.error('Error incrementing click count:', error)
      return false
    }

    return true
  }

  async deleteItem(id: string): Promise<boolean> {
    // Get item info before deleting (for tracking)
    const { data: item } = await this.supabase
      .from('items')
      .select('list_id, name')
      .eq('id', id)
      .single()

    // Track subscription event BEFORE deleting so item_id exists
    const typedItem = item as { list_id: string; name: string } | null
    if (typedItem) {
      await trackItemRemoved(typedItem.list_id, id, typedItem.name)
    }
    
    const { error } = await this.supabase
      .from('items')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[DATABASE] Error deleting item:', error)
      return false
    }

    return true
  }
}

export const db = new DatabaseService()
