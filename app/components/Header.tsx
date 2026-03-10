import Image from 'next/image'
import LiveBadge from './LiveBadge'

interface HeaderProps {
  totalCount: number
  remoteCount: number
}

export default function Header({ totalCount, remoteCount }: HeaderProps) {
  return (
    <header className="py-10 border-b border-white/5 flex items-end justify-between gap-6 flex-wrap">

      {/* Left: logo + live badge */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" width={36} height={36} alt="TechHire" />
          <span className="text-2xl font-extrabold tracking-tight">
            <span className="text-indigo-400">Tech</span>
            <span className="text-white">Hire</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <LiveBadge />
        </div>
      </div>

      {/* Right: stats */}
      <div className="flex gap-3">
        {[
          { label: 'Total', value: totalCount.toLocaleString() },
          { label: 'Remote', value: remoteCount.toLocaleString() },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-3 text-center min-w-[72px]"
          >
            <div className="text-xl font-semibold text-white tracking-tight">
              {stat.value}
            </div>
            <div className="text-[11px] text-white/25 mt-0.5 uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

    </header>
  )
}