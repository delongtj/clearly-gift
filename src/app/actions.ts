'use server'

import { createClient } from '@/lib/auth'
import { DatabaseService } from '@/lib/database'

export async function createItemAction(
  listId: string,
  name: string,
  description?: string,
  url?: string
) {
  const supabase = await createClient()
  
  // Verify user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser()
  console.log('[createItemAction] Auth check:', { userId: user?.id, error })
  
  if (!user) {
    throw new Error(`Unauthorized: ${error?.message || 'No session'}`)
  }
  
  const dbService = new DatabaseService(supabase)
  return await dbService.createItem(listId, name, description, url)
}

export async function updateItemAction(
  listId: string,
  itemId: string,
  updates: { name?: string; description?: string; url?: string }
) {
  const supabase = await createClient()
  const dbService = new DatabaseService(supabase)
  return await dbService.updateItem(itemId, updates)
}

export async function deleteItemAction(itemId: string) {
  const supabase = await createClient()
  const dbService = new DatabaseService(supabase)
  return await dbService.deleteItem(itemId)
}
