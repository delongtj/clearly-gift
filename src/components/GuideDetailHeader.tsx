'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function GuideDetailHeader() {
  const [user, setUser] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(!!data.user)
    }
    checkAuth()
  }, [])

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">clearly.gift</span>
          </a>
          <div className="flex items-center space-x-4">
            <a href="/guides" className="text-gray-600 hover:text-gray-900 font-medium">
              All Guides
            </a>
            <a href="/" className="text-gray-600 hover:text-gray-900 font-medium">
              Home
            </a>
            {user ? (
              <Link href="/dashboard" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 font-medium shadow-sm hover:shadow-md transition-all active:scale-95">
                Dashboard
              </Link>
            ) : (
              <a href="/auth" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 font-medium">
                Get Started
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
