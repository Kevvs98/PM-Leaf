'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { sortByBitacora } from '@/lib/bitacora'
import StatusBadge from '@/components/StatusBadge'

const PRIORITY_STYLES: Record<string, string> = {
  Alta: 'bg-red-50 text-red-700',
  Media: 'bg-amber-50 text-amber-700',
  Baja: 'bg-slate-100 text-slate-600',
}

interface Props {
  data: any[]
  totalUnfiltered: number
  today: string
  memberMap: Record<string, string>
}

export function DependenciaProjectsTable({ data, totalUnfiltered, today, memberMap }: Props) {
  const [sortMode, setSortMode] = useState<'bitacora' | 'date'>('bitacora')
  const [filter, setFilter] = useState('')

  const sorted =
    sortMode === 'bitacora'
      ? sortByBitacora(data)
      : [...data].sort((a, b) =>
          (b.created_at ?? '').localeCompare(a.created_at ?? '')
        )

  const rows = filter
    ? sorted.filter((p) =>
        (p.bitacora_number ?? '').toLowerCase().includes(filter.toLowerCase())
      )
    : sorted

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-medium text-slate-700 text-sm">
              Proyectos
              <span className="ml-2 text-slate-400 font-normal">({rows.length})</span>
            </h2>
            {totalUnfiltered > data.length && (
              <p className="text-xs text-slate-400 mt-0.5">
                Mostrando {data.length} de {totalUnfiltered} con los filtros actuales
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setSortMode('bitacora')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  sortMode === 'bitacora'
                    ? 'bg-white text-slate-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Por bitácora
              </button>
              <button
                onClick={() => setSortMode('date')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  sortMode === 'date'
                    ? 'bg-white text-slate-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Por fecha
              </button>
            </div>

            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filtrar por No. Bitácora…"
                className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48 bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 font-medium text-slate-500 whitespace-nowrap">Nombre</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500 whitespace-nowrap">Cliente</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500 whitespace-nowrap">Tipo</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500 whitespace-nowrap">Estado</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500 whitespace-nowrap">Prioridad</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500 whitespace-nowrap">No. Bitácora</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500 whitespace-nowrap">Inicio</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500 whitespace-nowrap">Notificación</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500 whitespace-nowrap">Fecha límite est.</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500 whitespace-nowrap">Resp. técnico</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500 whitespace-nowrap">Account manager</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {!rows.length && (
              <tr>
                <td colSpan={11} className="text-center py-10 text-slate-400">
                  {filter
                    ? 'Sin resultados para ese número de bitácora'
                    : 'Sin proyectos para esta dependencia con los filtros seleccionados'}
                </td>
              </tr>
            )}
            {rows.map((p) => {
              const priorityStyle = PRIORITY_STYLES[p.priority ?? ''] ?? 'bg-slate-100 text-slate-600'
              const fmtDate = (d?: string | null) =>
                d ? new Date(d + 'T12:00:00').toLocaleDateString('es-MX') : '—'

              return (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <Link
                      href={`/projects/${p.id}`}
                      className="font-medium text-slate-700 hover:text-emerald-600 transition-colors"
                    >
                      {p.name}
                    </Link>
                    {p.project_code && (
                      <p className="text-xs text-slate-400 mt-0.5">{p.project_code}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                    {p.clients?.name ?? '—'}
                  </td>
                  <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                    {p.project_types?.name ?? '—'}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    {p.priority ? (
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyle}`}>
                        {p.priority}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-5 py-3 text-slate-500">{p.bitacora_number ?? '—'}</td>
                  <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{fmtDate(p.start_date)}</td>
                  <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{fmtDate(p.notification_date)}</td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    {p.estimated_delivery_date ? (
                      <span className={p.estimated_delivery_date < today ? 'text-red-600 font-medium' : 'text-slate-500'}>
                        {fmtDate(p.estimated_delivery_date)}
                      </span>
                    ) : (
                      <span className="text-slate-300 text-xs">Sin fecha</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                    {p.technical_responsible_id ? (memberMap[p.technical_responsible_id] ?? '—') : '—'}
                  </td>
                  <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                    {p.account_manager_id ? (memberMap[p.account_manager_id] ?? '—') : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
