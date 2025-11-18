'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function PublicHeader() {
  const [user, setUser] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(!!data.user)
    }
    checkAuth()
  }, [])

  return (
    <header className="border-b border-gray-200 sticky top-0 z-40 bg-white/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Image
              src="/clearly-gift-logo.png"
              alt="clearly.gift"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-2xl font-bold text-gray-900">clearly.gift</span>
          </Link>
          <div className="flex items-center space-x-3">
            {user ? (
              <Link href="/dashboard" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 font-medium shadow-sm hover:shadow-md transition-all active:scale-95">
                Dashboard
              </Link>
            ) : (
              <Link href="/auth" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Sign In
              </Link>
            )}
            {!user && (
              <Link href="/auth" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 font-medium shadow-sm hover:shadow-md transition-all active:scale-95">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
