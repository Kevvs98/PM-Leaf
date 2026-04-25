import { supabase } from '@/lib/supabase'
import PageHeader from '@/components/PageHeader'

export default async function TeamPage() {
  const { data: members, error } = await supabase
    .from('team_members')
    .select('*')
    .order('name')

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Equipo" description="Miembros del equipo de trabajo" />

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          Error al cargar equipo: {error.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {!members?.length && (
          <p className="text-slate-400 text-sm col-span-3 text-center py-10">Sin miembros registrados</p>
        )}
        {members?.map((m) => (
          <div key={m.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
              {m.name?.charAt(0) ?? '?'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-slate-800 truncate">{m.name}</p>
                {m.active === false && (
                  <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full flex-shrink-0">Inactivo</span>
                )}
              </div>
              {m.department && <p className="text-xs text-slate-500 mt-0.5">{m.department}</p>}
              {m.email && <p className="text-xs text-slate-400 mt-1 truncate">{m.email}</p>}
              {m.phone && <p className="text-xs text-slate-400">{m.phone}</p>}
              {m.availability_percent != null && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full"
                      style={{ width: `${m.availability_percent}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{m.availability_percent}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
