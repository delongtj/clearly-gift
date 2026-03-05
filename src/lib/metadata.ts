export interface UrlMetadata {
  title: string | null
  description: string | null
  image: string | null
}

type MetadataProvider = (url: string) => Promise<UrlMetadata>

const EMPTY: UrlMetadata = { title: null, description: null, image: null }

/** Strip common retailer suffixes from titles */
function cleanTitle(title: string | null, url: string): string | null {
  if (!title) return null

  const suffixes = [
    / - Walmart\.com$/i,
    / - [Ww]almart$/i,
    / \| Walmart$/i,
    / - Target$/i,
    / \| Target$/i,
    / - Best Buy$/i,
    / \| Best Buy$/i,
    / - Etsy$/i,
    / \| Etsy$/i,
    / : (?:Home & Kitchen|Tools & Home Improvement|Electronics|Clothing, Shoes & Jewelry|Sports & Outdoors|Toys & Games|Beauty & Personal Care|Health & Household|Patio, Lawn & Garden|Automotive|Pet Supplies|Baby|Industrial & Scientific|Arts, Crafts & Sewing|Office Products|Cell Phones & Accessories|Grocery & Gourmet Food|Musical Instruments|Appliances|Video Games|Movies & TV|Books|Software|Magazine Subscriptions|Kindle Store|Digital Music|Amazon Devices & Accessories|Everything Else)$/,
  ]

  let cleaned = title
  for (const suffix of suffixes) {
    cleaned = cleaned.replace(suffix, '')
  }

  return cleaned.trim() || null
}

/** For Amazon, the OG description is usually a better product name than the title */
function isAmazonUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname
    return /amazon\.(com|co\.\w+|ca|de|fr|it|es|in|com\.br|com\.mx|com\.au|nl|sg|ae|sa|pl|se|be|eg|ng|co\.za)$/.test(hostname)
  } catch {
    return false
  }
}

const microlinkProvider: MetadataProvider = async (url) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)

  try {
    const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}`
    const response = await fetch(apiUrl, { signal: controller.signal })

    if (!response.ok) return EMPTY

    const json = await response.json()
    const data = json?.data
    if (!data) return EMPTY

    const rawTitle: string | null = data.title || null
    const rawDescription: string | null = data.description || null
    const image: string | null = data.image?.url || null

    // For Amazon, prefer description as the product name (title is usually generic)
    let title: string | null
    if (isAmazonUrl(url) && rawDescription) {
      title = rawDescription
    } else {
      title = cleanTitle(rawTitle, url)
    }

    return { title, description: rawDescription, image }
  } catch {
    return EMPTY
  } finally {
    clearTimeout(timeout)
  }
}

export async function fetchUrlMetadata(url: string): Promise<UrlMetadata> {
  return microlinkProvider(url)
}
