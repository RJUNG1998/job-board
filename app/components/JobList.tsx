'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useTheme } from 'next-themes'
import JobCard from './JobCard'
import { Job } from '../types/job'
import NewJobsBadge from './NewJobBadge'
import { RealtimePostgresInsertPayload } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase-browser'

const PAGE_SIZE = 20
const NEW_THRESHOLD = 30 * 60 * 1000

interface JobListProps {
  onStatsUpdate: (today: number, week: number, month: number) => void
}

export default function JobList({ onStatsUpdate }: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [brandNewIds, setBrandNewIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [pendingJobs, setPendingJobs] = useState<Job[]>([])
  const [now, setNow] = useState(Date.now())
  const [mounted, setMounted] = useState(false)

  const { theme } = useTheme()
  const isDark = mounted && theme === 'dark'

  const bottomRef = useRef<HTMLDivElement>(null)
  const fetchCursor = useRef<string>('')
  const todayCountRef = useRef(0)
  const weekCountRef = useRef(0)
  const monthCountRef = useRef(0)

  useEffect(() => { setMounted(true) }, [])

  // 1분마다 now 업데이트
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(interval)
  }, [])

  // 초기 로드
  const fetchJobs = useCallback(async () => {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const [{ count: todayCount }, { count: weekCount }, { count: monthCount }, { data }] = await Promise.all([
      supabase.from('jobs').select('*', { count: 'exact', head: true }).gte('posted_at', todayStart),
      supabase.from('jobs').select('*', { count: 'exact', head: true }).gte('posted_at', weekAgo),
      supabase.from('jobs').select('*', { count: 'exact', head: true }).gte('posted_at', monthAgo),
      supabase.from('jobs').select('*').order('posted_at', { ascending: false }).limit(PAGE_SIZE),
    ])

    if (!data) return

    const jobs = data as Job[]
    if (jobs.length > 0) {
      fetchCursor.current = jobs[jobs.length - 1].posted_at ?? ''
    }
    setJobs(jobs)
    setHasMore(jobs.length === PAGE_SIZE)
    todayCountRef.current = todayCount ?? 0
    weekCountRef.current = weekCount ?? 0
    monthCountRef.current = monthCount ?? 0
    onStatsUpdate(todayCountRef.current, weekCountRef.current, monthCountRef.current)
    setLoading(false)
  }, [onStatsUpdate])

  // 추가 로드
  const fetchMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)

    const { data } = await supabase
      .from('jobs')
      .select('*')
      .order('posted_at', { ascending: false })
      .lt('posted_at', fetchCursor.current)
      .limit(PAGE_SIZE)

    if (!data || data.length === 0) {
      setHasMore(false)
      setLoadingMore(false)
      return
    }

    if (data.length > 0) {
      fetchCursor.current = data[data.length - 1].posted_at ?? ''
    }

    setJobs(prev => [...prev, ...data as Job[]])
    setHasMore(data.length === PAGE_SIZE)
    setLoadingMore(false)
  }, [loadingMore, hasMore])

  // 대기 중인 포지션 반영 (뱃지 클릭)
  const flushPending = useCallback(() => {
    if (pendingJobs.length === 0) return
    const ids = new Set(pendingJobs.map(j => j.id))
    setJobs(prev => {
      const merged = [...pendingJobs, ...prev]
      return merged.sort((a, b) =>
        new Date(b.posted_at ?? 0).getTime() - new Date(a.posted_at ?? 0).getTime()
      )
    })
    setBrandNewIds(ids)
    setPendingJobs([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => setBrandNewIds(new Set()), 10000)
  }, [pendingJobs])

  // Intersection Observer
  useEffect(() => {
    if (loading) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) fetchMore() },
      { threshold: 0.1 }
    )
    if (bottomRef.current) observer.observe(bottomRef.current)
    return () => observer.disconnect()
  }, [fetchMore, loading])

  // Realtime 구독
  useEffect(() => {
    fetchJobs()

    const channel = supabase
      .channel('jobs-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'jobs' },
        (payload: RealtimePostgresInsertPayload<Job>) => {
          const newJob = payload.new as Job
          setPendingJobs(prev => [newJob, ...prev])

          const posted = new Date(newJob.posted_at ?? Date.now())
          const now = new Date()
          const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

          if (posted >= todayStart) todayCountRef.current += 1
          if (posted >= weekAgo) weekCountRef.current += 1
          if (posted >= monthAgo) monthCountRef.current += 1

          onStatsUpdate(todayCountRef.current, weekCountRef.current, monthCountRef.current)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchJobs, onStatsUpdate])

  if (loading) {
    return (
      <div className="flex flex-col gap-2 mt-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`h-20 rounded-xl animate-pulse ${isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'}`}
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-24 ${isDark ? 'text-white/20' : 'text-black/20'}`}>
        <span className="text-4xl mb-4">📭</span>
        <p className="text-sm">No jobs yet. Run /api/fetch-jobs to populate.</p>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <p className={`text-[11px] font-semibold tracking-widest uppercase mb-3 ${isDark ? 'text-white/20' : 'text-black/30'}`}>
        Latest positions
      </p>

      {pendingJobs.length > 0 && (
        <div className="fixed top-26 left-1/2 -translate-x-1/2 z-50">
          <NewJobsBadge count={pendingJobs.length} onClick={flushPending} />
        </div>
      )}

      <div className="flex flex-col gap-2">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            now={now}
            isDark={isDark}
            isNew={!!job.posted_at && now - new Date(job.posted_at).getTime() < NEW_THRESHOLD}
            isBrandNew={brandNewIds.has(job.id)}
          />
        ))}
      </div>

      <div ref={bottomRef} className="py-4 flex justify-center">
        {loadingMore && (
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? 'bg-white/20' : 'bg-black/20'}`}
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        )}
        {!hasMore && jobs.length > 0 && (
          <p className={`text-[11px] ${isDark ? 'text-white/20' : 'text-black/30'}`}>모든 포지션을 불러왔어요</p>
        )}
      </div>
    </div>
  )
}