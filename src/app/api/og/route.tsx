import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              backgroundColor: '#059669',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
            }}
          >
            <span style={{ color: 'white', fontSize: 36, fontWeight: 'bold' }}>C</span>
          </div>
          <span style={{ fontSize: 56, fontWeight: 'bold', color: '#111827' }}>
            clearly.gift
          </span>
        </div>
        <div style={{ fontSize: 32, color: '#6b7280', marginBottom: 48 }}>
          Share your wishlist. Keep the surprise.
        </div>
        <div
          style={{
            display: 'flex',
            gap: 32,
            color: '#059669',
            fontSize: 20,
          }}
        >
          <span>Simple wish lists</span>
          <span>No sign-up to claim</span>
          <span>Free forever</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
