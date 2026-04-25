import { supabase } from '@/lib/supabase'
import StatCard from '@/components/StatCard'
import { FolderOpen, AlertCircle, Clock, Users } from 'lucide-react'
import Link from 'next/link'

async function getDashboardStats() {
  const [
    { count: activeProjects },
    { count: overdueTasks },
    { data: upcomingDeadlines },
    { data: tasksByResponsible },
  ] = await Promise.all([
    supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .in('status', ['Planeación', 'En curso', 'En revisión']),
    supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .not('status', 'in', '("Completada","Aprobada")')
      .lt('due_date', new Date().toISOString().split('T')[0]),
    supabase
      .from('view_project_deadline_progress')
      .select('id, name, deadline_date, progress_percentage')
      .order('deadline_date', { ascending: true })
      .limit(5),
    supabase
      .from('tasks')
      .select('assigned_to, team_members!tasks_assigned_to_fkey(name)')
      .neq('status', 'completada')
      .not('assigned_to', 'is', null),
  ])

  // Group tasks by responsible
  const responsibleMap: Record<string, { name: string; count: number }> = {}
  if (tasksByResponsible) {
    for (const t of tasksByResponsible as any[]) {
      if (!t.assigned_to) continue
      const key = t.assigned_to
      const member = t.team_members
      const name = member ? (member as any).name : 'Sin asignar'
      if (!responsibleMap[key]) responsibleMap[key] = { name, count: 0 }
      responsibleMap[key].count++
    }
  }

  return {
    activeProjects: activeProjects ?? 0,
    overdueTasks: overdueTasks ?? 0,
    upcomingDeadlines: upcomingDeadlines ?? [],
    tasksByResponsible: Object.values(responsibleMap).sort((a, b) => b.count - a.count),
  }
}

export default async function DashboardPage() {
  const { activeProjects, overdueTasks, upcomingDeadlines, tasksByResponsible } =
    await getDashboardStats()

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Resumen general del estado de proyectos y tareas</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Proyectos activos"
          value={activeProjects}
          icon={FolderOpen}
          color="emerald"
        />
        <StatCard
          label="Tareas vencidas"
          value={overdueTasks}
          icon={AlertCircle}
          color="red"
          description="Pendientes con fecha pasada"
        />
        <StatCard
          label="Próximos vencimientos"
          value={upcomingDeadlines.length}
          icon={Clock}
          color="amber"
          description="Con seguimiento de días hábiles"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-medium text-slate-700 text-sm">Próximos vencimientos</h2>
            <Link href="/projects/prevenciones" className="text-xs text-emerald-600 hover:underline">
              Ver prevenciones →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {upcomingDeadlines.length === 0 && (
              <p className="px-5 py-6 text-sm text-slate-400 text-center">Sin vencimientos próximos</p>
            )}
            {upcomingDeadlines.map((d: any) => (
              <Link
                key={d.id}
                href={`/projects/${d.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm text-slate-700 truncate max-w-[200px]">{d.name}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-slate-100 rounded-full h-1.5">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full"
                      style={{ width: `${Math.min(d.progress_percentage ?? 0, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-8 text-right">
                    {Math.round(d.progress_percentage ?? 0)}%
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Tasks by Responsible */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-medium text-slate-700 text-sm">Tareas por responsable</h2>
            <Link href="/tasks" className="text-xs text-emerald-600 hover:underline">
              Ver tareas →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {tasksByResponsible.length === 0 && (
              <p className="px-5 py-6 text-sm text-slate-400 text-center">Sin tareas asignadas</p>
            )}
            {tasksByResponsible.map((r) => (
              <div key={r.name} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-medium">
                    {r.name.charAt(0)}
                  </div>
                  <span className="text-sm text-slate-700">{r.name}</span>
                </div>
                <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                  {r.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
