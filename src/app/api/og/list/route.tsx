import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const name = searchParams.get('name') || 'Wish List'
  const items = searchParams.get('items') || '0'

  const itemText = items === '1' ? '1 item' : `${items} items`

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
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              backgroundColor: '#059669',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <span style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>C</span>
          </div>
          <span style={{ fontSize: 28, fontWeight: 'bold', color: '#9ca3af' }}>
            clearly.gift
          </span>
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: 16,
            maxWidth: 900,
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 28, color: '#6b7280', marginBottom: 48 }}>
          {itemText}
        </div>
        <div
          style={{
            fontSize: 20,
            color: '#059669',
            backgroundColor: '#ecfdf5',
            padding: '12px 24px',
            borderRadius: 8,
          }}
        >
          View list and claim gifts
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
