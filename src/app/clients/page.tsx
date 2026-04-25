import { supabase } from '@/lib/supabase'
import PageHeader from '@/components/PageHeader'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default async function ClientsPage() {
  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .order('name')

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Clientes" description="Listado de todos los clientes registrados" />

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          Error al cargar clientes: {error.message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 font-medium text-slate-500">Nombre</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">RFC</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Email</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Teléfono</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {!clients?.length && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400">
                  Sin clientes registrados
                </td>
              </tr>
            )}
            {clients?.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-700">{c.name}</td>
                <td className="px-5 py-3 text-slate-500">{c.rfc ?? '—'}</td>
                <td className="px-5 py-3 text-slate-500">{c.email ?? '—'}</td>
                <td className="px-5 py-3 text-slate-500">{c.phone ?? '—'}</td>
                <td className="px-5 py-3 text-right">
                  <ChevronRight size={14} className="text-slate-300 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
