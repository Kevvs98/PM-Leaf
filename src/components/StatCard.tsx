import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  color?: 'emerald' | 'red' | 'amber' | 'blue'
  description?: string
}

const colorMap = {
  emerald: 'bg-emerald-50 text-emerald-600',
  red: 'bg-red-50 text-red-600',
  amber: 'bg-amber-50 text-amber-600',
  blue: 'bg-blue-50 text-blue-600',
}

export default function StatCard({ label, value, icon: Icon, color = 'emerald', description }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 flex items-start gap-4 shadow-sm">
      <div className={`p-2.5 rounded-lg ${colorMap[color]}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-semibold text-slate-800 mt-0.5">{value}</p>
        {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
      </div>
    </div>
  )
}
