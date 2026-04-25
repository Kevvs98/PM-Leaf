import { supabase } from '@/lib/supabase'
import PageHeader from '@/components/PageHeader'

export default async function ProjectTypesPage() {
  const { data: types, error } = await supabase
    .from('project_types')
    .select('*')
    .order('name')

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Tipos de Proyecto" description="Catálogo de tipos de proyecto" />

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          Error: {error.message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 font-medium text-slate-500">Nombre</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Descripción</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Registrado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {!types?.length && (
              <tr>
                <td colSpan={3} className="text-center py-10 text-slate-400">
                  Sin tipos de proyecto
                </td>
              </tr>
            )}
            {types?.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-700">{t.name}</td>
                <td className="px-5 py-3 text-slate-500">{t.description ?? '—'}</td>
                <td className="px-5 py-3 text-slate-500">
                  {new Date(t.created_at).toLocaleDateString('es-MX')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
