'use server'

import { db } from '@/lib/database'

export async function createItemAction(
  listId: string,
  name: string,
  description?: string,
  url?: string
) {
  return await db.createItem(listId, name, description, url)
}

export async function updateItemAction(
  listId: string,
  itemId: string,
  updates: { name?: string; description?: string; url?: string }
) {
  return await db.updateItem(listId, itemId, updates)
}
