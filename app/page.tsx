'use client'

import { useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import Navbar from './components/Navbar'
import JobList from './components/JobList'

export default function Home() {
  const [stats, setStats] = useState({ today: 0, week: 0, month: 0 })
  const { theme } = useTheme()

  const handleStatsUpdate = useCallback((today: number, week: number, month: number) => {
    setStats({ today, week, month })
  }, [])

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#0A0A0F]' : 'bg-[#f8f8fc]'
    }`}>

      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,194,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,194,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: theme === 'dark' ? 1 : 0.3,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <Navbar
          todayCount={stats.today}
          weekCount={stats.week}
          monthCount={stats.month}
        />
        <JobList
          onStatsUpdate={handleStatsUpdate}
        />
      </div>

    </div>
  )
}