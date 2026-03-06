'use client'

interface NewJobsBadgeProps {
  count: number
  onClick: () => void
}

export default function NewJobsBadge({ count, onClick }: NewJobsBadgeProps) {
  if (count === 0) return null

  return (
    <button
      onClick={onClick}
      className="w-full mb-3 py-2 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-colors"
    >
      <span>↑</span>
      <span>{count} new position{count > 1 ? 's' : ''}</span>
    </button>
  )
}