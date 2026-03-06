'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import JobCard from './JobCard'
import { Job } from '../types/job'
import { supabase } from '../lib/supabase'
import NewJobsBadge from './NewJobBadge'

const PAGE_SIZE = 20
const NEW_THRESHOLD = 30 * 60 * 1000

interface JobListProps {
  onStatsUpdate: (total: number, remote: number, newCount: number) => void
}

export default function JobList({ onStatsUpdate }: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [brandNewIds, setBrandNewIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [pendingJobs, setPendingJobs] = useState<Job[]>([])
  const [now, setNow] = useState(Date.now())

  const bottomRef = useRef<HTMLDivElement>(null)
  const fetchCursor = useRef<string>('')
  const totalCountRef = useRef(0)
  const remoteCountRef = useRef(0)

  // 초기 로드
  const fetchJobs = useCallback(async () => {
    const [{ count: totalCount }, { count: remoteCount }, { data }] = await Promise.all([
      // 전체 수
      supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true }),  // head: true = 데이터 안 가져오고 count만

      // 리모트 수
      supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('is_remote', true),

      // 실제 데이터 20개
      supabase.from('jobs').select('*').order('posted_at', { ascending: false }).limit(PAGE_SIZE),
    ])

    if (!data) return

    const jobs = data as Job[]
    if (jobs.length > 0) {
      fetchCursor.current = jobs[jobs.length - 1].posted_at ?? ''
    }
    setJobs(jobs)
    setHasMore(jobs.length === PAGE_SIZE)
    totalCountRef.current = totalCount ?? 0
    remoteCountRef.current = remoteCount ?? 0
    onStatsUpdate(totalCountRef.current, remoteCountRef.current, 0)
    setLoading(false)
  }, [])

  // 추가 로드
  const fetchMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)

    const { data } = await supabase
      .from('jobs')
      .select('*')
      .order('posted_at', { ascending: false })
      .lt('posted_at', fetchCursor.current) // 첫 row 이전 데이터만
      .limit(PAGE_SIZE)

    if (!data || data.length === 0) {
      setHasMore(false)
      setLoadingMore(false)
      return
    }

    if (data.length > 0) {
      fetchCursor.current = data[data.length - 1].posted_at ?? ''  // ← 커서 업데이트
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
      return merged.sort((a,b) =>
        new Date(b.posted_at ?? 0).getTime() - new Date(a.posted_at ?? 0).getTime()
      )
    })
    setBrandNewIds(ids)
    setPendingJobs([])

    window.scrollTo({ top: 0, behavior: 'smooth' })  // ← 이렇게
  }, [pendingJobs])

  // Intersection Observer — 스크롤 맨 아래 감지
  useEffect(() => {
    if (loading) return  // ← loading 끝날 때까지 기다림
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchMore()
      },
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
        (payload) => {
          const newJob = payload.new as Job
          setPendingJobs(prev => [newJob, ...prev])
          
          totalCountRef.current += 1
          if (newJob.is_remote) remoteCountRef.current += 1

          onStatsUpdate(totalCountRef.current, remoteCountRef.current, 0)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchJobs])

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000) // 1분마다
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-2 mt-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-white/[0.03] animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-white/20">
        <span className="text-4xl mb-4">📭</span>
        <p className="text-sm">No jobs yet. Run /api/fetch-jobs to populate.</p>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-white/20 mb-3">
        Latest positions
      </p>

      {pendingJobs.length > 0 && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <NewJobsBadge count={pendingJobs.length} onClick={flushPending} />
        </div>
      )}

      <div className="flex flex-col gap-2">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            now={now}
            isNew={!!job.posted_at && now - new Date(job.posted_at).getTime() < NEW_THRESHOLD}
            isBrandNew={brandNewIds.has(job.id)}
          />
        ))}
      </div>

      {/* Intersection Observer 타겟 */}
      <div ref={bottomRef} className="py-4 flex justify-center">
        {loadingMore && (
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        )}
        {!hasMore && jobs.length > 0 && (
          <p className="text-[11px] text-white/20">모든 포지션을 불러왔어요</p>
        )}
      </div>
    </div>
  )
}