import { supabase } from '@/lib/supabase'
import PageHeader from '@/components/PageHeader'

export default async function TaskTemplatesPage() {
  const { data: templates, error } = await supabase
    .from('task_templates')
    .select('*, project_types(name)')
    .order('project_type_id')
    .order('sort_order')

  // Group by project type
  const grouped: Record<string, typeof templates> = {}
  if (templates) {
    for (const t of templates) {
      const key = (t.project_types as any)?.name ?? 'Sin tipo'
      if (!grouped[key]) grouped[key] = []
      grouped[key]!.push(t)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Plantillas de Tarea" description="Tareas predefinidas por tipo de proyecto" />

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          Error: {error.message}
        </div>
      )}

      {!templates?.length && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-10 text-center text-slate-400 text-sm">
          Sin plantillas registradas
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(grouped).map(([typeName, items]) => (
          <div key={typeName} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
              <h2 className="text-sm font-medium text-slate-700">{typeName}</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-2.5 font-medium text-slate-400 text-xs">#</th>
                  <th className="text-left px-5 py-2.5 font-medium text-slate-400 text-xs">Nombre</th>
                  <th className="text-left px-5 py-2.5 font-medium text-slate-400 text-xs">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items?.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-2.5 text-slate-400 text-xs w-8">{t.sort_order ?? '—'}</td>
                    <td className="px-5 py-2.5 font-medium text-slate-700">{t.name}</td>
                    <td className="px-5 py-2.5 text-slate-500">{t.description ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}
