import { supabase } from '@/lib/supabase'
import PageHeader from '@/components/PageHeader'
import { PrevencionesTableClient } from './PrevencionesTableClient'
import type { PrevencionRow } from './PrevencionesTableClient'

export default async function PrevencionesPage() {
  const today = new Date().toISOString().split('T')[0]

  const { data: projectsRaw, error } = await supabase
    .from('view_prevenciones')
    .select('*')

  const projects = projectsRaw as any[] | null

  // Fetch all business days from the earliest notification_date up to today
  const earliestDate = projects
    ?.map((p) => p.notification_date)
    .filter(Boolean)
    .sort()[0]

  let businessDaySet = new Set<string>()
  if (earliestDate) {
    const { data: calDays } = await supabase
      .from('calendar_days')
      .select('date')
      .eq('is_business_day', true)
      .gte('date', earliestDate)
      .lte('date', today)

    businessDaySet = new Set(((calDays as any[]) ?? []).map((d) => d.date))
  }

  function countBusinessDays(from: string, to: string): number {
    if (!from || !to || from >= to) return 0
    let count = 0
    const cur = new Date(from)
    const end = new Date(to)
    while (cur < end) {
      const key = cur.toISOString().split('T')[0]
      if (businessDaySet.has(key)) count++
      cur.setDate(cur.getDate() + 1)
    }
    return count
  }

  // Pre-compute per-row derived values so the client component is purely presentational
  const rows: PrevencionRow[] = (projects ?? []).map((p) => {
    const total = p.deadline_business_days ?? 0
    const elapsed = p.notification_date ? countBusinessDays(p.notification_date, today) : null
    const remaining = elapsed !== null && total ? total - elapsed : null
    const pct = elapsed !== null && total ? Math.min(Math.round((elapsed / total) * 100), 100) : null
    const isOverdue = remaining !== null && remaining < 0

    return {
      id: p.id,
      name: p.name,
      bitacora_number: p.bitacora_number,
      project_code: p.project_code,
      client_name: p.client_name,
      notification_date: p.notification_date,
      estimated_delivery_date: p.estimated_delivery_date,
      status: p.status,
      created_at: p.created_at,
      elapsed,
      remaining,
      pct,
      total,
      isOverdue,
    }
  })

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Prevenciones" description="Proyectos con seguimiento de días hábiles" />

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          Error al cargar prevenciones: {(error as any).message}
        </div>
      )}

      <PrevencionesTableClient data={rows} />
    </div>
  )
}
