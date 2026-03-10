'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase-browser'
import LiveBadge from './LiveBadge'


interface NavbarProps {
  todayCount?: number
  weekCount?: number
  monthCount?: number
}

export default function Navbar({ todayCount = 0, weekCount = 0, monthCount = 0 }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null)
  const [plan, setPlan] = useState<'free' | 'pro'>('free')
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)

    supabase.auth.getUser().then(async ({ data: { user } }: { data: { user: User | null } }) => {
      setUser(user)
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('plan')
          .eq('id', user.id)
          .single()
        setPlan(data?.plan ?? 'free')
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: { user: User | null }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        const { data } = await supabase
          .from('users')
          .select('plan')
          .eq('id', u.id)
          .single()
        setPlan(data?.plan ?? 'free')
      } else {
        setPlan('free')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const handleUpgrade = async () => {
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  const isDark = mounted && theme === 'dark'

  return (
    <nav className={`sticky top-0 z-50 flex items-center justify-between gap-6 py-5 border-b backdrop-blur-md transition-colors duration-200 ${
      isDark
        ? 'bg-[#0A0A0F]/80 border-white/5'
        : 'bg-[#f8f8fc]/80 border-black/5'
    }`}>

      {/* Left: 로고 + LiveBadge */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <img src="/logo.svg" width={32} height={32} alt="TechHire" />
          <span className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
            <span className="text-indigo-400">Tech</span>
            <span className={isDark ? 'text-white' : 'text-gray-900'}>Hire</span>
          </span>
        </div>
        <LiveBadge />
      </div>

      {/* Center: Stats */}
      <div className="flex items-center gap-2">
        {[
          { label: 'Today',  value: todayCount.toLocaleString() },
          { label: '7 Days', value: weekCount.toLocaleString() },
          { label: '30 Days', value: monthCount.toLocaleString() },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-lg px-4 py-2 text-center min-w-[64px] border transition-colors ${
              isDark
                ? 'bg-white/[0.03] border-white/[0.06]'
                : 'bg-black/[0.03] border-black/[0.06]'
            }`}
          >
            <div className={`text-base font-semibold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {stat.value}
            </div>
            <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-white/25' : 'text-black/30'}`}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Right: Auth + 토글 */}
      <div className="flex items-center gap-3">

        {/* 다크/라이트 토글 */}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors ${
            isDark
              ? 'border-white/10 text-white/40 hover:text-white/70 hover:bg-white/5'
              : 'border-black/10 text-black/40 hover:text-black/70 hover:bg-black/5'
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
            </svg>
          )}
        </button>

        {!user ? (
          <button
            onClick={handleLogin}
            className={`flex items-center gap-2 text-sm transition-colors px-3 py-1.5 rounded-lg border ${
              isDark
                ? 'text-white/50 hover:text-white/80 hover:bg-white/5 border-white/10'
                : 'text-black/50 hover:text-black/80 hover:bg-black/5 border-black/10'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in
          </button>
        ) : (
          <div className="flex items-center gap-3">
            {plan === 'free' && (
              <button
                onClick={handleUpgrade}
                className="text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-400 transition-colors px-3 py-1.5 rounded-lg"
              >
                Upgrade to Pro
              </button>
            )}

            <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-md ${
              plan === 'pro'
                ? 'text-indigo-400 bg-indigo-400/10 border border-indigo-400/20'
                : isDark
                  ? 'text-white/30 bg-white/5 border border-white/10'
                  : 'text-black/30 bg-black/5 border border-black/10'
            }`}>
              {plan === 'pro' ? '✦ Pro' : 'Free'}
            </span>

            {user.user_metadata?.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                className="w-7 h-7 rounded-full"
                alt="avatar"
              />
            )}

            <button
              onClick={handleLogout}
              className={`text-xs transition-colors ${
                isDark ? 'text-white/25 hover:text-white/50' : 'text-black/25 hover:text-black/50'
              }`}
            >
              Sign out
            </button>
          </div>
        )}
      </div>

    </nav>
  )
}