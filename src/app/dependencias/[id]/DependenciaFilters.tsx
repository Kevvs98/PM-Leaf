'use client'

import { useRouter } from 'next/navigation'

interface FilterOption {
  id: string
  name: string
}

interface Props {
  agencyId: string
  currentFilters: {
    tipo?: string
    estado?: string
    prioridad?: string
    cliente?: string
    fecha_desde?: string
    fecha_hasta?: string
    sin_fecha?: string
  }
  options: {
    projectTypes: FilterOption[]
    clients: FilterOption[]
  }
}

const STATUSES = [
  'Planeación',
  'En curso',
  'En revisión',
  'Entregado',
  'Cerrado',
  'Pausado',
  'Cancelado',
]

const PRIORITIES = ['Alta', 'Media', 'Baja']

export default function DependenciaFilters({ agencyId, currentFilters, options }: Props) {
  const router = useRouter()

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams()
    const current = {
      tipo: currentFilters.tipo ?? '',
      estado: currentFilters.estado ?? '',
      prioridad: currentFilters.prioridad ?? '',
      cliente: currentFilters.cliente ?? '',
      fecha_desde: currentFilters.fecha_desde ?? '',
      fecha_hasta: currentFilters.fecha_hasta ?? '',
      sin_fecha: currentFilters.sin_fecha ?? '',
      [key]: value,
    }
    for (const [k, v] of Object.entries(current)) {
      if (v) params.set(k, v)
    }
    const qs = params.toString()
    router.push(`/dependencias/${agencyId}${qs ? `?${qs}` : ''}`)
  }

  function clearFilters() {
    router.push(`/dependencias/${agencyId}`)
  }

  const hasFilters = Object.values(currentFilters).some(Boolean)

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Filtros</p>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Tipo */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Tipo</label>
          <select
            value={currentFilters.tipo ?? ''}
            onChange={(e) => updateFilter('tipo', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700"
          >
            <option value="">Todos</option>
            {options.projectTypes.map((pt) => (
              <option key={pt.id} value={pt.id}>{pt.name}</option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Estado</label>
          <select
            value={currentFilters.estado ?? ''}
            onChange={(e) => updateFilter('estado', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700"
          >
            <option value="">Todos</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Prioridad */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Prioridad</label>
          <select
            value={currentFilters.prioridad ?? ''}
            onChange={(e) => updateFilter('prioridad', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700"
          >
            <option value="">Todas</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Cliente */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Cliente</label>
          <select
            value={currentFilters.cliente ?? ''}
            onChange={(e) => updateFilter('cliente', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700"
          >
            <option value="">Todos</option>
            {options.clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Fecha desde */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Inicio desde</label>
          <input
            type="date"
            value={currentFilters.fecha_desde ?? ''}
            onChange={(e) => updateFilter('fecha_desde', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
          />
        </div>

        {/* Fecha hasta */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Inicio hasta</label>
          <input
            type="date"
            value={currentFilters.fecha_hasta ?? ''}
            onChange={(e) => updateFilter('fecha_hasta', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
          />
        </div>
      </div>

      {/* Sin fecha checkbox */}
      <div className="mt-3 flex items-center gap-2">
        <input
          id="sin_fecha"
          type="checkbox"
          checked={currentFilters.sin_fecha === 'true'}
          onChange={(e) => updateFilter('sin_fecha', e.target.checked ? 'true' : '')}
          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
        />
        <label htmlFor="sin_fecha" className="text-xs text-slate-500 cursor-pointer">
          Mostrar solo proyectos sin fecha límite estimada
        </label>
      </div>
    </div>
  )
}
