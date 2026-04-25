import { supabase } from '@/lib/supabase'
import PageHeader from '@/components/PageHeader'
import { ProjectViewTable } from '../ProjectViewTable'

export default async function GeneralProjectsPage() {
  const { data: raw, error } = await supabase
    .from('view_general_projects')
    .select('*')

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Proyectos Generales" description="Proyectos de tipo general" />

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          Error al cargar proyectos: {(error as any).message}
        </div>
      )}

      <ProjectViewTable data={raw as any[] ?? []} emptyMessage="Sin proyectos generales" />
    </div>
  )
}
