export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface List {
  id: string
  user_id: string
  name: string
  token: string
  created_at: string
  updated_at: string
  view_count?: number
}

export interface Item {
  id: string
  list_id: string
  name: string
  description?: string
  url?: string
  formatted_url?: string
  claimed_at?: string
  claimed_by?: string
  position: number
  created_at: string
  updated_at: string
  click_count?: number
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at'>>
      }
      lists: {
        Row: List
        Insert: Omit<List, 'id' | 'created_at' | 'updated_at' | 'view_count'>
        Update: Partial<Omit<List, 'id' | 'created_at' | 'user_id' | 'token'>>
      }
      items: {
        Row: Item
        Insert: Omit<Item, 'id' | 'created_at' | 'updated_at' | 'click_count' | 'position'> & { position?: number }
        Update: Partial<Omit<Item, 'id' | 'created_at' | 'list_id' | 'position'>> & { position?: number }
      }
    }
  }
}