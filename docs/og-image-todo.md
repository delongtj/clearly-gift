# Open Graph Image TODO

The metadata for public list pages references `/og-image.png` which doesn't exist yet.

## Quick Solution

Create a simple 1200x630 PNG image with:
- clearly.gift branding
- Tagline: "Share your wishlist, keep the surprise"
- Emerald green brand color (#059669)
- White background

Save as: `/public/og-image.png`

## Better Solution: Dynamic OG Images

Use Vercel's OG Image generation to create dynamic images for each list:

1. Install `@vercel/og`:
   ```bash
   npm install @vercel/og
   ```

2. Create `/app/api/og/[token]/route.tsx`:
   ```tsx
   import { ImageResponse } from '@vercel/og'
   import { supabase } from '@/lib/supabase'

   export async function GET(request: Request, { params }: { params: { token: string } }) {
     const { token } = params

     // Fetch list data
     const { data: list } = await supabase
       .from('lists')
       .select('name')
       .eq('token', token)
       .single()

     return new ImageResponse(
       (
         <div style={{
           background: '#f9fafb',
           width: '100%',
           height: '100%',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           flexDirection: 'column',
         }}>
           <div style={{ fontSize: 60, fontWeight: 'bold', color: '#059669' }}>
             {list?.name || 'Wish List'}
           </div>
           <div style={{ fontSize: 30, color: '#6b7280', marginTop: 20 }}>
             clearly.gift
           </div>
         </div>
       ),
       {
         width: 1200,
         height: 630,
       }
     )
   }
   ```

3. Update metadata to use dynamic image:
   ```typescript
   images: [
     {
       url: `/api/og/${token}`,
       width: 1200,
       height: 630,
       alt: listName,
     },
   ]
   ```

## Resources

- [Vercel OG Image Documentation](https://vercel.com/docs/functions/edge-functions/og-image-generation)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
