export interface ItemMetadata {
  title?: string
  description?: string
  image?: string
}

export async function fetchItemMetadata(url: string): Promise<ItemMetadata | null> {
  try {
    const response = await fetch(
      `/api/fetch-metadata?url=${encodeURIComponent(url)}`
    )

    if (!response.ok) {
      console.error(`Failed to fetch metadata: ${response.status}`)
      return null
    }

    const data = await response.json()
    return {
      title: data.title,
      description: data.description,
      image: data.image,
    }
  } catch (error) {
    console.error('Error fetching metadata:', error)
    return null
  }
}
