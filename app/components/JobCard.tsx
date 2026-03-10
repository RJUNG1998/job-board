import { Job } from "../types/job"

interface JobCardProps {
  job: Job
  now: number
  isNew: boolean
  isBrandNew: boolean
  isDark: boolean
}

const SOURCE_COLORS: Record<string, string> = {
  adzuna:     '#00C2FF',
  greenhouse: '#24C45C',
  lever:      '#FF6B35',
  ashby:      '#A78BFA',
  arbeitnow:  '#F59E0B',
}

const timeAgo = (dateStr: string, now: number) => {
  const diff = now - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const formatSalary = (min: number | null, max: number | null) => {
  if (!min && !max) return null
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `${fmt(min)}+`
  return `up to ${fmt(max!)}`
}

export default function JobCard({ job, now, isNew, isBrandNew, isDark }: JobCardProps) {
  const salary = formatSalary(job.salary_min, job.salary_max)
  const color = SOURCE_COLORS[job.source] ?? '#94A3B8'
  const postedTime = job.posted_at ? timeAgo(job.posted_at, now) : timeAgo(job.fetched_at, now)

  return (
    <a
      href={job.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group flex items-center justify-between gap-4 px-5 py-4 rounded-xl border
        transition-all duration-150 cursor-pointer
        ${isBrandNew
          ? 'bg-green-500/5 border-green-500/20 animate-slideIn'
          : isDark
            ? 'bg-white/[0.025] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/10'
            : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.04] hover:border-black/10'
        }
      `}
    >
      {/* Left */}
      <div className="flex items-center gap-4 min-w-0">

        {/* Company initial */}
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img
            src={`https://www.google.com/s2/favicons?domain=${job.company.toLowerCase().replace(/\s+/g, '')}.com&sz=64`}
            alt={job.company}
            className="w-7 h-7 object-contain"
            onError={(e) => {
              const target = e.currentTarget
              target.style.display = 'none'
              const fallback = target.nextElementSibling as HTMLElement
              if (fallback) fallback.style.display = 'flex'
            }}
          />
          {/* 폴백: 이미지 실패시 이니셜 */}
          <div
            className="w-9 h-9 rounded-lg items-center justify-center text-sm font-bold hidden"
            style={{ background: `${color}22`, border: `1px solid ${color}33`, display: 'none' }}
          >
            <span style={{ color }}>{job.company[0].toUpperCase()}</span>
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {isNew && (
              <span className="text-[10px] font-bold tracking-wider uppercase text-green-400 bg-green-400/10 border border-green-400/25 rounded px-1.5 py-0.5">
                New
              </span>
            )}
            {job.is_remote && (
              <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 rounded px-1.5 py-0.5">
                Remote
              </span>
            )}
          </div>
          <div className={`text-sm font-semibold truncate ${isDark ? 'text-white/90' : 'text-gray-900'}`}>
            {job.title}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>{job.company}</span>
            {job.location && (
              <span className={`text-xs ${isDark ? 'text-white/25' : 'text-gray-400'}`}>· {job.location}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        {salary && (
          <span className="text-sm font-semibold text-emerald-400">
            {salary}
          </span>
        )}
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
          <span className={`text-[11px] ${isDark ? 'text-white/20' : 'text-gray-400'}`}>{postedTime}</span>
        </div>
      </div>
    </a>
  )
}