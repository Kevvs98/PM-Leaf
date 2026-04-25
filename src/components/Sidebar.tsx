'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Contact,
  FolderOpen,
  CheckSquare,
  UserCircle,
  Tag,
  FileText,
  ChevronDown,
  ChevronRight,
  Leaf,
  Building2,
} from 'lucide-react'
import { useState } from 'react'

const nav = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Clientes', href: '/clients', icon: Users },
  { label: 'Contactos', href: '/contacts', icon: Contact },
  {
    label: 'Proyectos',
    icon: FolderOpen,
    children: [
      { label: 'Todos', href: '/projects' },
      { label: 'Generales', href: '/projects/general' },
      { label: 'Prevenciones', href: '/projects/prevenciones' },
      { label: 'INAH', href: '/projects/inah' },
    ],
  },
  { label: 'Dependencias', href: '/dependencias', icon: Building2 },
  { label: 'Tareas', href: '/tasks', icon: CheckSquare },
  { label: 'Equipo', href: '/team', icon: UserCircle },
  { label: 'Tipos de Proyecto', href: '/project-types', icon: Tag },
  { label: 'Plantillas de Tarea', href: '/task-templates', icon: FileText },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [projectsOpen, setProjectsOpen] = useState(
    pathname.startsWith('/projects')
  )

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-slate-100 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-100">
        <Leaf className="text-emerald-600" size={20} />
        <span className="font-semibold text-slate-800 tracking-tight text-lg">PM Leaf</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map((item) => {
          if (item.children) {
            const isActive = pathname.startsWith('/projects')
            return (
              <div key={item.label}>
                <button
                  onClick={() => setProjectsOpen(!projectsOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <item.icon size={16} />
                    {item.label}
                  </span>
                  {projectsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                {projectsOpen && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-100 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
                          pathname === child.href
                            ? 'text-emerald-700 font-medium bg-emerald-50'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-5 py-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">PM Leaf · Interno</p>
      </div>
    </aside>
  )
}
