import { supabase } from '@/lib/supabase'
import PageHeader from '@/components/PageHeader'
import { NewProjectButton } from './NewProjectButton'
import { AllProjectsTable } from './AllProjectsTable'

export default async function AllProjectsPage() {
  const [
    { data: projectsRaw, error },
    { data: clients },
    { data: projectTypes },
  ] = await Promise.all([
    supabase.from('projects').select('*, clients(name), project_types(name)'),
    supabase.from('clients').select('id, name').order('name'),
    supabase.from('project_types').select('id, name').order('name'),
  ] as const) as any[]

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Todos los Proyectos"
        description="Listado completo de proyectos"
        action={
          <NewProjectButton
            clients={clients ?? []}
            projectTypes={projectTypes ?? []}
          />
        }
      />

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          Error al cargar proyectos: {(error as any).message}
        </div>
      )}

      <AllProjectsTable data={projectsRaw ?? []} />
    </div>
  )
}
