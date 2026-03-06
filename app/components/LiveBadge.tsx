'use client'

export default function LiveBadge() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center w-2.5 h-2.5">
        <span className="absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-40 animate-ping" />
        <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-green-400" />
      </div>
      <span className="text-xs font-medium tracking-widest uppercase text-green-400">
        Live Feed
      </span>
    </div>
  )
}