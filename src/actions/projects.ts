'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function createProject(formData: FormData) {
  const name = formData.get('name') as string
  const client_id = formData.get('client_id') as string | null
  const project_type_id = formData.get('project_type_id') as string | null
  const status = (formData.get('status') as string) || 'activo'
  const start_date = formData.get('start_date') as string | null
  const end_date = formData.get('end_date') as string | null
  const description = formData.get('description') as string | null
  const bitacora_number = formData.get('bitacora_number') as string | null

  const { error } = await supabase.from('projects').insert({
    name,
    client_id: client_id || null,
    project_type_id: project_type_id || null,
    status,
    start_date: start_date || null,
    end_date: end_date || null,
    description: description || null,
    bitacora_number: bitacora_number || null,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/projects')
}

export async function updateTask(id: string, status: string) {
  const { error } = await supabase.from('tasks').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/tasks')
}
