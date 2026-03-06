'use client'

import { useState, useCallback } from 'react'
import Header from './components/Header'
import JobList from './components/JobList'

export default function Home() {
  const [stats, setStats] = useState({ total: 0, remote: 0 })

  const handleStatsUpdate = useCallback((total: number, remote: number) => {
    setStats({ total, remote })
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0F]">

      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,194,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,194,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <Header
          totalCount={stats.total}
          remoteCount={stats.remote}
        />
        <JobList
          onStatsUpdate={handleStatsUpdate}
        />
      </div>

    </div>
  )
}