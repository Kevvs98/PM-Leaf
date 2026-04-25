const statusStyles: Record<string, string> = {
  // Task statuses
  'por hacer': 'bg-slate-100 text-slate-600',
  'en curso': 'bg-blue-100 text-blue-700',
  'en revisión': 'bg-amber-100 text-amber-700',
  'completada': 'bg-emerald-100 text-emerald-700',
  'aprobada': 'bg-emerald-100 text-emerald-700',
  'bloqueada': 'bg-red-100 text-red-600',
  // Project statuses
  'planeación': 'bg-slate-100 text-slate-600',
  'en curso': 'bg-blue-100 text-blue-700',
  'en revisión': 'bg-amber-100 text-amber-700',
  'entregado': 'bg-emerald-100 text-emerald-700',
  'cerrado': 'bg-slate-100 text-slate-500',
  'pausado': 'bg-orange-100 text-orange-700',
  'cancelado': 'bg-red-100 text-red-600',
}

export default function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status?.toLowerCase()] ?? 'bg-slate-100 text-slate-600'
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  )
}
