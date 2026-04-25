'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { sortByBitacora } from '@/lib/bitacora'
import StatusBadge from '@/components/StatusBadge'

export interface PrevencionRow {
  id: string
  name?: string | null
  bitacora_number?: string | null
  project_code?: string | null
  client_name?: string | null
  notification_date?: string | null
  estimated_delivery_date?: string | null
  status: string
  created_at?: string | null
  // pre-computed on the server
  elapsed: number | null
  remaining: number | null
  pct: number | null
  total: number
  isOverdue: boolean
}

interface Props {
  data: PrevencionRow[]
}

export function PrevencionesTableClient({ data }: Props) {
  const [sortMode, setSortMode] = useState<'bitacora' | 'notification'>('bitacora')
  const [filter, setFilter] = useState('')

  const sorted =
    sortMode === 'bitacora'
      ? sortByBitacora(data as any[]) as PrevencionRow[]
      : [...data].sort((a, b) =>
          (a.notification_date ?? '').localeCompare(b.notification_date ?? '')
        )

  const rows = filter
    ? sorted.filter((p) =>
        (p.bitacora_number ?? '').toLowerCase().includes(filter.toLowerCase())
      )
    : sorted

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
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
            onClick={() => setSortMode('notification')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              sortMode === 'notification'
                ? 'bg-white text-slate-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Por notificación
          </button>
        </div>

        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filtrar por No. Bitácora…"
            className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 w-52 bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 font-medium text-slate-500">Proyecto</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">No. Bitácora</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Cliente</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Notificación</th>
              <th className="text-right px-5 py-3 font-medium text-slate-500">Transcurridos</th>
              <th className="text-right px-5 py-3 font-medium text-slate-500">Restantes</th>
              <th className="text-right px-5 py-3 font-medium text-slate-500">Total</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Progreso</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Vencimiento</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {!rows.length && (
              <tr>
                <td colSpan={10} className="text-center py-10 text-slate-400">
                  {filter ? 'Sin resultados para ese número de bitácora' : 'Sin prevenciones registradas'}
                </td>
              </tr>
            )}
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3">
                  <Link
                    href={`/projects/${p.id}`}
                    className="font-medium text-slate-700 hover:text-emerald-600 transition-colors"
                  >
                    {p.name ?? '—'}
                  </Link>
                  {p.project_code && (
                    <p className="text-xs text-slate-400">{p.project_code}</p>
                  )}
                </td>
                <td className="px-5 py-3 text-slate-500">{p.bitacora_number ?? '—'}</td>
                <td className="px-5 py-3 text-slate-500">{p.client_name ?? '—'}</td>
                <td className="px-5 py-3 text-slate-500">
                  {p.notification_date
                    ? new Date(p.notification_date + 'T12:00:00').toLocaleDateString('es-MX')
                    : '—'}
                </td>
                <td className="px-5 py-3 text-right text-slate-600">{p.elapsed ?? '—'}</td>
                <td className={`px-5 py-3 text-right font-medium ${p.isOverdue ? 'text-red-600' : 'text-slate-600'}`}>
                  {p.remaining !== null
                    ? p.isOverdue
                      ? `${Math.abs(p.remaining)} vencido${Math.abs(p.remaining) !== 1 ? 's' : ''}`
                      : p.remaining
                    : '—'}
                </td>
                <td className="px-5 py-3 text-right text-slate-400">{p.total || '—'}</td>
                <td className="px-5 py-3">
                  {p.pct !== null ? (
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            p.pct >= 100 ? 'bg-red-500' : p.pct >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${p.pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 w-8">{p.pct}%</span>
                    </div>
                  ) : '—'}
                </td>
                <td className={`px-5 py-3 text-sm ${p.isOverdue ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
                  {p.estimated_delivery_date
                    ? new Date(p.estimated_delivery_date + 'T12:00:00').toLocaleDateString('es-MX')
                    : '—'}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
