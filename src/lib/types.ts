// ─── Core table row types ──────────────────────────────────────────────────

export interface Client {
  id: string
  name: string
  rfc?: string
  address?: string
  phone?: string
  email?: string
  created_at: string
}

export interface Contact {
  id: string
  client_id?: string
  name: string
  email?: string
  phone?: string
  position?: string
  notes?: string
  created_at: string
  clients?: { name: string }
}

export interface Agency {
  id: string
  name: string
  nivel?: string
  estado?: string
  email?: string
  phone?: string
  created_at: string
}

export interface TeamMember {
  id: string
  name: string
  email?: string
  phone?: string
  department?: string
  availability_percent?: number
  active?: boolean
  notes?: string
  created_at: string
  updated_at?: string
}

export interface Role {
  id: string
  name: string
  description?: string
}

export interface TeamMemberRole {
  team_member_id: string
  role_id: string
}

export interface ProjectType {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface Project {
  id: string
  name: string
  client_id?: string
  project_type_id?: string
  agency_id?: string
  status: string
  priority?: string
  start_date?: string
  end_date?: string
  notification_date?: string
  estimated_delivery_date?: string
  account_manager_id?: string
  technical_responsible_id?: string
  description?: string
  bitacora_number?: string
  project_code?: string
  created_at: string
  clients?: { name: string }
  project_types?: { name: string }
}

export interface TaskTemplate {
  id: string
  project_type_id?: string
  name: string
  description?: string
  default_role_id?: string
  default_responsible_id?: string
  phase?: string
  priority?: string
  offset_days?: number
  duration_days?: number
  sort_order?: number
  requires_deliverable?: boolean
  deliverable_name?: string
  active?: boolean
  created_at?: string
  updated_at?: string
  project_types?: { name: string }
}

export interface Task {
  id: string
  project_id?: string
  task_template_id?: string
  name: string
  description?: string
  assigned_to?: string
  role_id?: string
  phase?: string
  priority?: string
  status: string
  start_date?: string
  due_date?: string
  completed_at?: string
  notes?: string
  created_at: string
  updated_at?: string
  projects?: { name: string }
  team_members?: { name: string }
}

export interface CalendarDay {
  date: string
  is_business_day: boolean
  note?: string
}

export interface ProjectDeadlineDay {
  id: string
  project_id: string
  calendar_day_date: string
  day_index: number
}

export interface Deliverable {
  id: string
  project_id?: string
  name: string
  description?: string
  due_date?: string
  delivered_at?: string
  status: string
  projects?: { name: string }
}

export interface Uga {
  id: string
  name: string
  code?: string
}

export interface ProjectUga {
  project_id: string
  uga_id: string
  ugas?: Uga
}

// ─── View types ────────────────────────────────────────────────────────────

export interface ViewGeneralProject {
  id: string
  name: string
  client_name?: string
  project_type_name?: string
  status: string
  start_date?: string
  end_date?: string
  description?: string
  created_at: string
}

export interface ViewPrevencion {
  id: string
  project_code?: string
  name?: string
  client_id?: string
  project_type_id?: string
  agency_id?: string
  status: string
  priority?: string
  start_date?: string
  estimated_delivery_date?: string
  notification_date?: string
  drive_folder_url?: string
  bitacora_number?: string
  resolutivo?: string
  filed_in_record?: boolean
  notes?: string
  created_at?: string
  updated_at?: string
  project_type_name?: string
  deadline_business_days?: number
  client_name?: string
  agency_name?: string
}

export interface ViewInahProject {
  id: string
  name: string
  client_name?: string
  project_type_name?: string
  status: string
  start_date?: string
  end_date?: string
  description?: string
  created_at: string
}

export interface ViewProjectDeadlineProgress {
  id: string
  name: string
  client_name?: string
  total_days?: number
  elapsed_days?: number
  remaining_days?: number
  progress_percentage?: number
  deadline_date?: string
}

// ─── Supabase Database generic type ──────────────────────────────────────

export type Database = {
  public: {
    Tables: {
      clients: { Row: Client; Insert: Omit<Client, 'id' | 'created_at'>; Update: Partial<Client> }
      contacts: { Row: Contact; Insert: Omit<Contact, 'id'>; Update: Partial<Contact> }
      agencies: { Row: Agency; Insert: Omit<Agency, 'id' | 'created_at'>; Update: Partial<Agency> }
      team_members: { Row: TeamMember; Insert: Omit<TeamMember, 'id' | 'created_at'>; Update: Partial<TeamMember> }
      roles: { Row: Role; Insert: Omit<Role, 'id'>; Update: Partial<Role> }
      team_member_roles: { Row: TeamMemberRole; Insert: TeamMemberRole; Update: Partial<TeamMemberRole> }
      project_types: { Row: ProjectType; Insert: Omit<ProjectType, 'id' | 'created_at'>; Update: Partial<ProjectType> }
      projects: { Row: Project; Insert: Omit<Project, 'id' | 'created_at'>; Update: Partial<Project> }
      task_templates: { Row: TaskTemplate; Insert: Omit<TaskTemplate, 'id'>; Update: Partial<TaskTemplate> }
      tasks: { Row: Task; Insert: Omit<Task, 'id' | 'created_at'>; Update: Partial<Task> }
      calendar_days: { Row: CalendarDay; Insert: CalendarDay; Update: Partial<CalendarDay> }
      project_deadline_days: { Row: ProjectDeadlineDay; Insert: Omit<ProjectDeadlineDay, 'id'>; Update: Partial<ProjectDeadlineDay> }
      deliverables: { Row: Deliverable; Insert: Omit<Deliverable, 'id'>; Update: Partial<Deliverable> }
      ugas: { Row: Uga; Insert: Omit<Uga, 'id'>; Update: Partial<Uga> }
      project_ugas: { Row: ProjectUga; Insert: ProjectUga; Update: Partial<ProjectUga> }
    }
    Views: {
      view_general_projects: { Row: ViewGeneralProject }
      view_prevenciones: { Row: ViewPrevencion }
      view_inah_projects: { Row: ViewInahProject }
      view_project_deadline_progress: { Row: ViewProjectDeadlineProgress }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
