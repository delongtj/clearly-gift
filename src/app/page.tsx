'use client'

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [user, setUser] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(!!data.user)
    }
    checkAuth()
  }, [])

  return (
    <div className="bg-white">
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

      <main className="w-full">
        {/* Hero Section with Background Image */}
        <section className="relative w-full py-16 md:py-24 text-center overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100">
        {/* Background Image */}
        <Image
        src="/hero-image.jpg"
        alt="Gift wrapping"
        fill
        priority
        sizes="100vw"
          quality={85}
             placeholder="blur"
             blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23059669;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2310b981;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='1200' height='600'/%3E%3C/svg%3E"
             className="absolute inset-0 w-full h-full object-cover"
           />
          
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 animate-fade-in">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg">
      The simplest way<br />to share your wish list
      </h1>
      <p className="text-base md:text-lg lg:text-xl text-white mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2 drop-shadow-md">
      Create beautiful, clutter-free wish lists that friends and family can view and claim gifts from — no sign-up required.
      </p>
      <Link href="/auth" className="inline-block bg-emerald-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all active:scale-95">
      Create Your List
      </Link>
      </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-3 gap-8">
          {[
            { 
              num: "1", 
              title: "Seamless Setup", 
              desc: "Just your email and a verification code. No lengthy forms or profiles." 
            },
            { 
              num: "2", 
              title: "Share Instantly", 
              desc: "Get a private link to share with family and friends. No accounts needed." 
            },
            { 
              num: "3", 
              title: "Clean & Private", 
              desc: "Beautifully minimal design with anonymous claiming to keep the surprise alive." 
            },
          ].map((feature, i) => (
            <div 
              key={i} 
              className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-full mx-auto mb-6 flex items-center justify-center text-emerald-600 font-bold text-lg">
                {feature.num}
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </section>


      </main>
    </div>
  )
}
