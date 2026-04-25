import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import StatusBadge from '@/components/StatusBadge'
import Link from 'next/link'
import { ArrowLeft, Calendar, User } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params

  const [
    { data: project },
    { data: tasks },
    { data: deliverables },
    { data: deadline },
  ] = await Promise.all([
    supabase
      .from('projects')
      .select('*, clients(name), project_types(name)')
      .eq('id', id)
      .single(),
    supabase
      .from('tasks')
      .select('*, team_members!tasks_assigned_to_fkey(name)')
      .eq('project_id', id)
      .order('created_at'),
    supabase
      .from('deliverables')
      .select('*')
      .eq('project_id', id)
      .order('due_date'),
    supabase
      .from('view_project_deadline_progress')
      .select('*')
      .eq('id', id)
      .maybeSingle(),
  ])

  if (!project) notFound()

  const tasksByStatus: Record<string, typeof tasks> = {}
  if (tasks) {
    for (const t of tasks) {
      if (!tasksByStatus[t.status]) tasksByStatus[t.status] = []
      tasksByStatus[t.status]!.push(t)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft size={14} />
        Volver a proyectos
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-6 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">{project.name}</h1>
            <p className="text-sm text-slate-500 mt-1">{(project.clients as any)?.name ?? 'Sin cliente'}</p>
          </div>
          <StatusBadge status={project.status} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Tipo</p>
            <p className="text-sm text-slate-700">{(project.project_types as any)?.name ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">No. Bitácora</p>
            <p className="text-sm text-slate-700">{project.bitacora_number ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Inicio</p>
            <p className="text-sm text-slate-700">
              {project.start_date ? new Date(project.start_date).toLocaleDateString('es-MX') : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Fin</p>
            <p className="text-sm text-slate-700">
              {project.end_date ? new Date(project.end_date).toLocaleDateString('es-MX') : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Registrado</p>
            <p className="text-sm text-slate-700">
              {new Date(project.created_at).toLocaleDateString('es-MX')}
            </p>
          </div>
        </div>

        {project.description && (
          <p className="text-sm text-slate-600 mt-4 pt-4 border-t border-slate-100">{project.description}</p>
        )}
      </div>

      {/* Deadline progress (if available) */}
      {deadline && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-6 py-5">
          <h2 className="font-medium text-slate-700 text-sm mb-4">Progreso de plazo (días hábiles)</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    (deadline.progress_percentage ?? 0) >= 100
                      ? 'bg-red-500'
                      : (deadline.progress_percentage ?? 0) >= 75
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(deadline.progress_percentage ?? 0, 100)}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-700 w-12 text-right">
              {Math.round(deadline.progress_percentage ?? 0)}%
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-xs text-slate-400">Total días</p>
              <p className="text-lg font-semibold text-slate-700">{deadline.total_days ?? '—'}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400">Transcurridos</p>
              <p className="text-lg font-semibold text-slate-700">{deadline.elapsed_days ?? '—'}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400">Restantes</p>
              <p className={`text-lg font-semibold ${(deadline.remaining_days ?? 0) < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                {deadline.remaining_days ?? '—'}
              </p>
            </div>
          </div>
          {deadline.deadline_date && (
            <p className="text-xs text-slate-400 mt-3 text-center">
              Vencimiento: {new Date(deadline.deadline_date).toLocaleDateString('es-MX')}
            </p>
          )}
        </div>
      )}

      {/* Tasks */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-medium text-slate-700 text-sm">Tareas ({tasks?.length ?? 0})</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {!tasks?.length && (
            <p className="px-6 py-8 text-sm text-slate-400 text-center">Sin tareas generadas</p>
          )}
          {tasks?.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-3">
                <StatusBadge status={t.status} />
                <span className="text-sm text-slate-700">{t.name}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                {(t.team_members as any)?.name && (
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {(t.team_members as any).name}
                  </span>
                )}
                {t.due_date && (
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(t.due_date).toLocaleDateString('es-MX')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverables */}
      {deliverables && deliverables.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-medium text-slate-700 text-sm">Entregables ({deliverables.length})</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {deliverables.map((d) => (
              <div key={d.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">{d.name}</p>
                  {d.description && <p className="text-xs text-slate-400 mt-0.5">{d.description}</p>}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <StatusBadge status={d.status} />
                  {d.due_date && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(d.due_date).toLocaleDateString('es-MX')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
