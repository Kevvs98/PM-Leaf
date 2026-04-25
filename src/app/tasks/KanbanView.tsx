'use client'

import { useState } from 'react'
import StatusBadge from '@/components/StatusBadge'
import { updateTask } from '@/actions/projects'
import Link from 'next/link'

interface Task {
  id: string
  name: string
  status: string
  project_id?: string | null
  due_date?: string | null
  projects?: { name: string } | null
  team_members?: { first_name: string; last_name: string } | null
}

interface Props {
  tasks: Task[]
  statuses: string[]
}

const columnColors: Record<string, string> = {
  'Por hacer': 'bg-slate-50 border-slate-200',
  'En curso': 'bg-blue-50 border-blue-100',
  'En revisión': 'bg-amber-50 border-amber-100',
  'Completada': 'bg-emerald-50 border-emerald-100',
  'Aprobada': 'bg-emerald-50 border-emerald-200',
  'Bloqueada': 'bg-red-50 border-red-100',
}

const columnLabels: Record<string, string> = {
  'Por hacer': 'Por hacer',
  'En curso': 'En curso',
  'En revisión': 'En revisión',
  'Completada': 'Completada',
  'Aprobada': 'Aprobada',
  'Bloqueada': 'Bloqueada',
}

export default function KanbanView({ tasks, statuses }: Props) {
  const [localTasks, setLocalTasks] = useState(tasks)

  const grouped = statuses.reduce<Record<string, Task[]>>((acc, s) => {
    acc[s] = localTasks.filter((t) => t.status === s)
    return acc
  }, {})

  async function handleStatusChange(taskId: string, newStatus: string) {
    setLocalTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    )
    await updateTask(taskId, newStatus)
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statuses.map((status) => (
        <div key={status} className={`rounded-xl border p-4 ${columnColors[status] ?? 'bg-slate-50 border-slate-100'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700">{columnLabels[status] ?? status}</span>
            <span className="text-xs bg-white text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
              {grouped[status]?.length ?? 0}
            </span>
          </div>
          <div className="space-y-2">
            {grouped[status]?.map((task) => (
              <div key={task.id} className="bg-white rounded-lg border border-slate-100 p-3 shadow-sm">
                <p className="text-sm font-medium text-slate-700 mb-2">{task.name}</p>
                {task.projects && (
                  <Link
                    href={`/projects/${task.project_id}`}
                    className="text-xs text-slate-400 hover:text-emerald-600 transition-colors block mb-2"
                  >
                    {(task.projects as any).name}
                  </Link>
                )}
                {task.due_date && (
                  <p className="text-xs text-slate-400 mb-2">
                    {new Date(task.due_date).toLocaleDateString('es-MX')}
                  </p>
                )}
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {columnLabels[s] ?? s}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            {grouped[status]?.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">Sin tareas</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
