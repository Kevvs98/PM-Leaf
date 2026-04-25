import { supabase } from '@/lib/supabase'
import PageHeader from '@/components/PageHeader'
import StatusBadge from '@/components/StatusBadge'
import Link from 'next/link'
import KanbanView from './KanbanView'

const STATUSES = ['Por hacer', 'En curso', 'En revisión', 'Completada', 'Aprobada', 'Bloqueada']

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>
}) {
  const { view } = await searchParams
  const isKanban = view === 'kanban'

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*, projects(name), team_members!tasks_assigned_to_fkey(name)')
    .order('due_date', { ascending: true })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Tareas</h1>
          <p className="text-sm text-slate-500 mt-1">Todas las tareas del sistema</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/tasks"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !isKanban ? 'bg-emerald-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Lista
          </Link>
          <Link
            href="/tasks?view=kanban"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isKanban ? 'bg-emerald-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Kanban
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          Error al cargar tareas: {error.message}
        </div>
      )}

      {isKanban ? (
        <KanbanView tasks={tasks ?? []} statuses={STATUSES} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 font-medium text-slate-500">Tarea</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Proyecto</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Responsable</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Estado</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Fase</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Vencimiento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {!tasks?.length && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Sin tareas
                  </td>
                </tr>
              )}
              {tasks?.map((t) => {
                const isOverdue =
                  t.due_date &&
                  !['Completada', 'Aprobada'].includes(t.status) &&
                  new Date(t.due_date) < new Date()
                return (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-700">{t.name}</td>
                    <td className="px-5 py-3 text-slate-500">
                      {(t.projects as any) ? (
                        <Link href={`/projects/${t.project_id}`} className="hover:text-emerald-600 transition-colors">
                          {(t.projects as any).name}
                        </Link>
                      ) : '—'}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {(t.team_members as any)?.name ?? '—'}
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-5 py-3 text-slate-500">{t.phase ?? '—'}</td>
                    <td className={`px-5 py-3 text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
                      {t.due_date ? new Date(t.due_date).toLocaleDateString('es-MX') : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
