'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState<'email' | 'code'>('email')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      })

      if (error) throw error

      setStage('code')
      setMessage({
        type: 'success',
        text: 'Check your email for the 6-digit code',
      })
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Something went wrong. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return
    
    const newCode = [...code]
    newCode[index] = value.slice(-1) // Take only the last character
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const digits = pastedData.replace(/\D/g, '').slice(0, 6)
    
    if (digits.length > 0) {
      const newCode = digits.split('').concat(Array(6 - digits.length).fill(''))
      setCode(newCode)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = code.join('')
    
    if (fullCode.length !== 6) {
      setMessage({
        type: 'error',
        text: 'Please enter all 6 digits',
      })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: fullCode,
        type: 'email',
      })

      if (error) throw error

      // Auto-redirect after verification
      window.location.href = '/dashboard'
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Invalid code. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg mx-auto mb-6 flex items-center justify-center hover:shadow-lg transition-all shadow-md">
              <span className="text-white font-bold text-xl">♥</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-2 text-sm">Sign in to manage your wish lists</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="flex-shrink-0 mt-0.5">
              {message.type === 'success' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {stage === 'email' ? (
          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 transition-all placeholder:text-gray-500"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-2.5 px-4 rounded-lg hover:bg-emerald-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md hover:shadow-lg"
            >
              {loading ? 'Sending...' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Enter verification code
              </label>
              <div className="flex gap-2 justify-center">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                    onPaste={handleCodePaste}
                    disabled={loading}
                    autoFocus={index === 0}
                    autoComplete="off"
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 transition-all"
                    placeholder="0"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Check your email for the 6-digit code
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || code.join('').length !== 6}
              className="w-full bg-emerald-600 text-white py-2.5 px-4 rounded-lg hover:bg-emerald-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md hover:shadow-lg"
            >
              {loading ? 'Verifying...' : 'Verify code'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStage('email')
                setCode(['', '', '', '', '', ''])
                setEmail('')
                setMessage(null)
              }}
              disabled={loading}
              className="w-full text-emerald-600 hover:text-emerald-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start over
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {stage === 'email'
              ? "We'll send you a 6-digit code to sign in"
              : 'Enter the code sent to your email'}
          </p>
        </div>
      </div>
    </div>
  )
}
