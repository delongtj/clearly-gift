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
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
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
