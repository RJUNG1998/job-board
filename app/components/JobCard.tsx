import { Job } from "../types/job"

interface JobCardProps {
  job: Job
  now: number
  isNew: boolean
  isBrandNew: boolean
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

export default function JobCard({ job, now, isNew, isBrandNew }: JobCardProps) {
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
          : 'bg-white/[0.025] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/10'
        }
      `}
    >
      {/* Left */}
      <div className="flex items-center gap-4 min-w-0">

        {/* Company initial */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{ background: `${color}22`, border: `1px solid ${color}33` }}
        >
          <span style={{ color }}>{job.company[0].toUpperCase()}</span>
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
          <div className="text-sm font-semibold text-white/90 truncate">
            {job.title}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-white/50">{job.company}</span>
            {job.location && (
              <span className="text-xs text-white/25">· {job.location}</span>
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
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: color }}
          />
          <span className="text-[11px] text-white/20">{postedTime}</span>
        </div>
      </div>
    </a>
  )
}