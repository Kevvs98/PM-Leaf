'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { sortByBitacora } from '@/lib/bitacora'
import StatusBadge from '@/components/StatusBadge'

interface Props {
  data: any[]
}

export function AllProjectsTable({ data }: Props) {
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
            className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 w-52 bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 font-medium text-slate-500">Nombre</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Cliente</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Tipo</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Estado</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Inicio</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Fin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {!rows.length && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-400">
                  {filter ? 'Sin resultados para ese número de bitácora' : 'Sin proyectos registrados'}
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
                    {p.name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-slate-500">{p.clients?.name ?? '—'}</td>
                <td className="px-5 py-3 text-slate-500">{p.project_types?.name ?? '—'}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {p.start_date ? new Date(p.start_date).toLocaleDateString('es-MX') : '—'}
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {p.end_date ? new Date(p.end_date).toLocaleDateString('es-MX') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
