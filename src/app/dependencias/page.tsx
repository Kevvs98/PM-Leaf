import { supabase } from '@/lib/supabase'
import PageHeader from '@/components/PageHeader'
import type { Agency } from '@/lib/types'
import Link from 'next/link'
import { Building2, ChevronRight } from 'lucide-react'

type AgencyRow = Agency & {
  nivel?: string
  estado?: string
  email?: string
  phone?: string
}

type ProjectRow = {
  id: string
  agency_id?: string
  status: string
  estimated_delivery_date?: string
}

export default async function DependenciasPage() {
  const [
    { data: agenciesRaw, error },
    { data: agencyProjectsRaw },
  ] = await Promise.all([
    supabase.from('agencies').select('*').order('name'),
    supabase
      .from('projects')
      .select('id, agency_id, status, estimated_delivery_date')
      .not('agency_id', 'is', null),
  ] as const) as any[]

  const agencies = agenciesRaw as AgencyRow[] | null
  const agencyProjects = agencyProjectsRaw as ProjectRow[] | null

  // Build per-agency stats
  type AgencyStats = {
    total: number
    active: number
    review: number
    nextDeadline: string | null
  }
  const statsMap = new Map<string, AgencyStats>()

  for (const p of agencyProjects ?? []) {
    if (!p.agency_id) continue
    const s = statsMap.get(p.agency_id) ?? { total: 0, active: 0, review: 0, nextDeadline: null }
    s.total++
    if (['Planeación', 'En curso', 'En revisión'].includes(p.status)) s.active++
    if (p.status === 'En revisión') s.review++
    if (p.estimated_delivery_date) {
      if (!s.nextDeadline || p.estimated_delivery_date < s.nextDeadline) {
        s.nextDeadline = p.estimated_delivery_date
      }
    }
    statsMap.set(p.agency_id, s)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Dependencias"
        description="Agencias y organismos con proyectos activos"
      />

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          Error al cargar dependencias: {(error as any).message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 font-medium text-slate-500">Nombre</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Nivel</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Estado</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Email</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Teléfono</th>
              <th className="text-right px-5 py-3 font-medium text-slate-500">Total</th>
              <th className="text-right px-5 py-3 font-medium text-slate-500">Activos</th>
              <th className="text-right px-5 py-3 font-medium text-slate-500">En revisión</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Próx. vencimiento</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {!agencies?.length && (
              <tr>
                <td colSpan={10} className="text-center py-10 text-slate-400">
                  Sin dependencias registradas
                </td>
              </tr>
            )}
            {agencies?.map((a) => {
              const stats = statsMap.get(a.id) ?? { total: 0, active: 0, review: 0, nextDeadline: null }
              return (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <Link
                      href={`/dependencias/${a.id}`}
                      className="flex items-center gap-2 font-medium text-slate-700 hover:text-emerald-600 transition-colors"
                    >
                      <Building2 size={14} className="text-slate-400 shrink-0" />
                      {a.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{a.nivel ?? '—'}</td>
                  <td className="px-5 py-3">
                    {a.estado ? (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {a.estado}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-5 py-3 text-slate-500">{a.email ?? '—'}</td>
                  <td className="px-5 py-3 text-slate-500">{a.phone ?? '—'}</td>
                  <td className="px-5 py-3 text-right text-slate-700 font-medium">{stats.total}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={stats.active > 0 ? 'text-emerald-600 font-medium' : 'text-slate-400'}>
                      {stats.active}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={stats.review > 0 ? 'text-amber-600 font-medium' : 'text-slate-400'}>
                      {stats.review}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {stats.nextDeadline
                      ? new Date(stats.nextDeadline + 'T12:00:00').toLocaleDateString('es-MX')
                      : '—'}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/dependencias/${a.id}`}
                      className="text-slate-400 hover:text-emerald-600 transition-colors inline-flex"
                    >
                      <ChevronRight size={16} />
                    </Link>
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
