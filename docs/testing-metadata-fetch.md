# Testing Metadata Fetching

Simple experiment to see if we can reliably fetch OG metadata from product URLs without a paid service.

## How to Test

1. `npm run dev` to start the server
2. Create a list and go to "Edit Items"
3. Paste a URL in the "Link" field
4. **Blur the field** (click away or press Tab)
5. Open browser DevTools console (F12 or Cmd+Option+J)
6. Look for "Fetched metadata:" log entry

## What to Try

### Likely to Work (Small Retailers)
- Etsy product: `https://www.etsy.com/listing/...`
- Indie retailer sites
- Small brand websites with OG tags

### Likely to Fail (Major Retailers)
- Amazon: `https://www.amazon.com/...`
- Walmart: `https://www.walmart.com/...`
- Target: `https://www.target.com/...`
- Best Buy: `https://www.bestbuy.com/...`

These block requests from cloud provider IPs (Vercel, AWS, Google Cloud) even with User-Agent spoofing.

## What You'll See

**Success:**
```
Fetched metadata: {
  title: "Product Name",
  description: "Product description...",
  image: "https://...",
  url: "https://..."
}
```

**Failure:**
```
Error fetching metadata: Failed to fetch metadata: Failed to fetch URL: 403 Forbidden
```

## Next Steps

If small retailers work reliably, we could build a UI to:
- Auto-populate title and description from metadata
- Show product images as thumbnails
- Cache metadata in the database to avoid repeated requests

If major retailers all fail, we'd need to explore paid solutions or accept manual entry.
