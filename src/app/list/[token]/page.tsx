import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import PublicListClient from './PublicListClient'

// Server-side metadata generation
export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params

  // Fetch list data for metadata
  const { data: listData } = await supabase
    .from('lists')
    .select('id, name')
    .eq('token', token)
    .single()

  if (!listData) {
    return {
      title: 'List Not Found | clearly.gift',
      description: 'This wish list could not be found.',
    }
  }

  const list = listData as { id: string; name: string }

  // Count items in the list
  const { count: itemCount } = await supabase
    .from('items')
    .select('*', { count: 'exact', head: true })
    .eq('list_id', list.id)

  const listName = list.name || 'Wish List'
  const itemText = itemCount === 1 ? '1 item' : `${itemCount || 0} items`
  const title = `${listName} | clearly.gift`
  const description = `View this wish list with ${itemText}. Claim gifts so others know what you're getting!`
  const url = `https://clearly.gift/list/${token}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'clearly.gift',
      type: 'website',
      images: [
        {
          url: '/og-image.png', // We can create this later
          width: 1200,
          height: 630,
          alt: listName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
    robots: {
      index: false, // Don't index individual lists for privacy
      follow: false,
    },
  }
}

export default async function PublicListPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  return <PublicListClient token={token} />
}
