import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  FolderOpen,
  AlertTriangle,
  Clock,
  CheckCircle2,
  CalendarClock,
} from 'lucide-react'
import type { Agency, ViewProjectDeadlineProgress } from '@/lib/types'
import StatusBadge from '@/components/StatusBadge'
import StatCard from '@/components/StatCard'
import DependenciaFilters from './DependenciaFilters'
import { DependenciaProjectsTable } from './DependenciaProjectsTable'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

type AgencyRow = Agency & {
  nivel?: string
  estado?: string
  email?: string
  phone?: string
}

type StatsProjectRow = {
  id: string
  status: string
  estimated_delivery_date?: string
}

type OverdueTaskRow = { id: string }
type TeamMemberRow = { id: string; name: string }

function str(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? '') : (v ?? '')
}

function fmtDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d + 'T12:00:00').toLocaleDateString('es-MX')
}

export default async function DependenciaDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const sp = await searchParams

  const filters = {
    tipo: str(sp.tipo),
    estado: str(sp.estado),
    prioridad: str(sp.prioridad),
    cliente: str(sp.cliente),
    fecha_desde: str(sp.fecha_desde),
    fecha_hasta: str(sp.fecha_hasta),
    sin_fecha: str(sp.sin_fecha),
  }

  const today = new Date().toISOString().split('T')[0]

  // Build filtered projects query (server-side filters via URL params)
  let projectsQuery = supabase
    .from('projects')
    .select('*, clients(name), project_types(name)')
    .eq('agency_id', id)

  if (filters.tipo) projectsQuery = projectsQuery.eq('project_type_id', filters.tipo)
  if (filters.estado) projectsQuery = projectsQuery.eq('status', filters.estado)
  if (filters.prioridad) projectsQuery = projectsQuery.eq('priority', filters.prioridad)
  if (filters.cliente) projectsQuery = projectsQuery.eq('client_id', filters.cliente)
  if (filters.fecha_desde) projectsQuery = projectsQuery.gte('start_date', filters.fecha_desde)
  if (filters.fecha_hasta) projectsQuery = projectsQuery.lte('start_date', filters.fecha_hasta)
  if (filters.sin_fecha === 'true') projectsQuery = projectsQuery.is('estimated_delivery_date', null)

  const [
    agencyResult,
    projectsResult,
    statsResult,
    overdueResult,
    deadlineResult,
    ptResult,
    clientsResult,
    membersResult,
  ] = await Promise.all([
    supabase.from('agencies').select('*').eq('id', id).single(),
    projectsQuery,
    supabase.from('projects').select('id, status, estimated_delivery_date').eq('agency_id', id),
    supabase
      .from('tasks')
      .select('id, projects!inner(agency_id)')
      .eq('projects.agency_id', id)
      .lt('due_date', today)
      .neq('status', 'Completada'),
    supabase.from('view_project_deadline_progress').select('*'),
    supabase.from('project_types').select('id, name').order('name'),
    supabase.from('clients').select('id, name').order('name'),
    supabase.from('team_members').select('id, name').order('name'),
  ] as const) as any[]

  const agency = agencyResult.data as AgencyRow | null
  const projects = projectsResult.data as any[] | null
  const projectsError = projectsResult.error as { message: string } | null
  const allProjectsForStats = statsResult.data as StatsProjectRow[] | null
  const overdueTasks = overdueResult.data as OverdueTaskRow[] | null
  const deadlineProgress = deadlineResult.data as ViewProjectDeadlineProgress[] | null
  const projectTypes = ptResult.data as { id: string; name: string }[] | null
  const clients = clientsResult.data as { id: string; name: string }[] | null
  const teamMembers = membersResult.data as TeamMemberRow[] | null

  if (!agency) notFound()

  // Summary stats (always from unfiltered set)
  const allProjects = allProjectsForStats ?? []
  const totalProjects = allProjects.length
  const activeProjects = allProjects.filter((p) =>
    ['Planeación', 'En curso', 'En revisión'].includes(p.status)
  ).length
  const reviewProjects = allProjects.filter((p) => p.status === 'En revisión').length

  const agencyProjectIds = new Set(allProjects.map((p) => p.id))
  const agencyDeadlines = (deadlineProgress ?? []).filter((d) => agencyProjectIds.has(d.id))

  const upcomingDeadlinesCount = agencyDeadlines.filter(
    (d) => d.remaining_days !== null && d.remaining_days !== undefined && d.remaining_days >= 0 && d.remaining_days <= 30
  ).length

  const overdueCount = overdueTasks?.length ?? 0

  // memberMap passed to the client table component (plain object, serializable)
  const memberMap: Record<string, string> = Object.fromEntries(
    (teamMembers ?? []).map((m) => [m.id, m.name])
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link
        href="/dependencias"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft size={14} />
        Volver a dependencias
      </Link>

      {/* Agency header */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-6 py-5">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <Building2 size={22} className="text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-slate-800">{agency.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              {agency.nivel && (
                <span className="text-xs text-slate-500">
                  Nivel: <span className="text-slate-700">{agency.nivel}</span>
                </span>
              )}
              {agency.estado && (
                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  {agency.estado}
                </span>
              )}
            </div>
          </div>
        </div>

        {(agency.email || agency.phone) && (
          <div className="flex flex-wrap gap-5 mt-4 pt-4 border-t border-slate-100">
            {agency.email && (
              <a
                href={`mailto:${agency.email}`}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 transition-colors"
              >
                <Mail size={14} />
                {agency.email}
              </a>
            )}
            {agency.phone && (
              <a
                href={`tel:${agency.phone}`}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 transition-colors"
              >
                <Phone size={14} />
                {agency.phone}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Total proyectos" value={totalProjects} icon={FolderOpen} color="emerald" />
        <StatCard label="Proyectos activos" value={activeProjects} icon={Clock} color="blue" />
        <StatCard label="En revisión" value={reviewProjects} icon={CheckCircle2} color="amber" />
        <StatCard
          label="Tareas vencidas"
          value={overdueCount}
          icon={AlertTriangle}
          color={overdueCount > 0 ? 'red' : 'emerald'}
        />
        <StatCard
          label="Próx. vencimientos"
          value={upcomingDeadlinesCount}
          icon={CalendarClock}
          color={upcomingDeadlinesCount > 0 ? 'amber' : 'emerald'}
          description="en los próximos 30 días"
        />
      </div>

      {/* Prevenciones y plazos */}
      {agencyDeadlines.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-medium text-slate-700 text-sm">Prevenciones y plazos</h2>
            <p className="text-xs text-slate-400 mt-0.5">Proyectos con seguimiento de días hábiles</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Proyecto</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Cliente</th>
                  <th className="text-right px-5 py-3 font-medium text-slate-500">Transcurridos</th>
                  <th className="text-right px-5 py-3 font-medium text-slate-500">Restantes</th>
                  <th className="text-right px-5 py-3 font-medium text-slate-500">Total</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Progreso</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Fecha límite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {agencyDeadlines.map((d) => {
                  const pct = Math.min(Math.round(d.progress_percentage ?? 0), 100)
                  const isOverdue = (d.remaining_days ?? 0) < 0
                  return (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3">
                        <Link
                          href={`/projects/${d.id}`}
                          className="font-medium text-slate-700 hover:text-emerald-600 transition-colors"
                        >
                          {d.name ?? '—'}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-slate-500">{d.client_name ?? '—'}</td>
                      <td className="px-5 py-3 text-right text-slate-600">{d.elapsed_days ?? '—'}</td>
                      <td className={`px-5 py-3 text-right font-medium ${isOverdue ? 'text-red-600' : 'text-slate-600'}`}>
                        {d.remaining_days !== null && d.remaining_days !== undefined
                          ? isOverdue
                            ? `${Math.abs(d.remaining_days)} vencido${Math.abs(d.remaining_days) !== 1 ? 's' : ''}`
                            : d.remaining_days
                          : '—'}
                      </td>
                      <td className="px-5 py-3 text-right text-slate-400">{d.total_days ?? '—'}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all ${
                                pct >= 100 ? 'bg-red-500' : pct >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500 w-9 shrink-0">{pct}%</span>
                        </div>
                      </td>
                      <td className={`px-5 py-3 text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
                        {fmtDate(d.deadline_date)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Server-side filters (tipo, estado, prioridad, cliente, dates) */}
      <DependenciaFilters
        agencyId={id}
        currentFilters={filters}
        options={{
          projectTypes: (projectTypes ?? []).map((pt) => ({ id: pt.id, name: pt.name })),
          clients: (clients ?? []).map((c) => ({ id: c.id, name: c.name })),
        }}
      />

      {projectsError && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg">
          Error al cargar proyectos: {projectsError.message}
        </div>
      )}

      {/* Client table — handles bitácora sort toggle + bitácora filter client-side */}
      <DependenciaProjectsTable
        data={projects ?? []}
        totalUnfiltered={totalProjects}
        today={today}
        memberMap={memberMap}
      />
    </div>
  )
}
