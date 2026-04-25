import { supabase } from '@/lib/supabase'
import PageHeader from '@/components/PageHeader'

export default async function ContactsPage() {
  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*, clients(name)')
    .order('name')

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Contactos" description="Directorio de contactos por cliente" />

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          Error al cargar contactos: {error.message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 font-medium text-slate-500">Nombre</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Cargo</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Email</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Teléfono</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Cliente</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Notas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {!contacts?.length && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-400">
                  Sin contactos registrados
                </td>
              </tr>
            )}
            {contacts?.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-700">{c.name}</td>
                <td className="px-5 py-3 text-slate-500">{c.position ?? '—'}</td>
                <td className="px-5 py-3 text-slate-500">{c.email ?? '—'}</td>
                <td className="px-5 py-3 text-slate-500">{c.phone ?? '—'}</td>
                <td className="px-5 py-3 text-slate-500">{(c.clients as any)?.name ?? '—'}</td>
                <td className="px-5 py-3 text-slate-400 text-xs max-w-xs truncate">{c.notes ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
