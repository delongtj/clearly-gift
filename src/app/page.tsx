'use client'

import Link from "next/link"
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
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 sticky top-0 z-40 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">♥</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">clearly.gift</span>
            </div>
            <div className="flex items-center space-x-3">
              <Link href={user ? "/dashboard" : "/auth"} className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                {user ? "Dashboard" : "Sign In"}
              </Link>
              {!user && (
                <Link href="/auth" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 font-medium shadow-sm hover:shadow-md transition-all active:scale-95">
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <section className="py-24 text-center">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              The simplest way<br />to share your wish list
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Create beautiful, clutter-free wish lists that friends and family can view and claim gifts from — no sign-up required.
            </p>
            <Link href="/auth" className="inline-block bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all active:scale-95">
              Create Your First List
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 grid md:grid-cols-3 gap-8">
          {[
            { 
              num: "1", 
              title: "Dead Simple Setup", 
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

        {/* Gift Guides Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white rounded-3xl border border-gray-200 px-8 mb-16">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Gift Guides</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Top Gifts for Toddlers 2025", desc: "10 perfect picks that'll keep the little ones happy and engaged." },
              { title: "Best Tech Gifts Under $100", desc: "Gadgets and accessories that won't break the bank." },
              { title: "Gifts for Coffee Lovers", desc: "From beans to brewers, everything for the caffeine connoisseur." },
            ].map((guide, i) => (
              <div 
                key={i} 
                className="bg-white p-8 rounded-xl border border-gray-200 hover:border-emerald-200 hover:shadow-lg transition-all hover:scale-105"
              >
                <h3 className="font-semibold mb-3 text-gray-900">{guide.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{guide.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/guides" className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-2 transition-colors">
              View All Guides
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
