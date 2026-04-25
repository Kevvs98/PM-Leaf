export interface BitacoraFields {
  year: number | null
  month: number | null
  folio: number | null
}

/**
 * Parses a bitácora number into sortable numeric fields.
 *
 * Full format:  31/S3-0111/02/26
 *   folio  = integer after the dash  (0111 → 111)
 *   month  = second-to-last segment  (02 → 2)
 *   year   = last segment + 2000     (26 → 2026)
 *
 * Short format: 186/26
 *   folio  = first segment           (186)
 *   month  = null
 *   year   = last segment + 2000     (26 → 2026)
 */
export function parseBitacora(bitacora: string | null | undefined): BitacoraFields {
  if (!bitacora) return { year: null, month: null, folio: null }

  const parts = bitacora.trim().split('/')
  const hasDash = parts.some((p) => p.includes('-'))

  if (hasDash) {
    // Full format
    const dashPart = parts.find((p) => p.includes('-')) ?? ''
    const afterDash = dashPart.split('-').slice(1).join('-')
    const folio = parseInt(afterDash, 10)
    const year = 2000 + parseInt(parts[parts.length - 1] ?? '', 10)
    const month = parseInt(parts[parts.length - 2] ?? '', 10)
    return {
      year: isNaN(year) ? null : year,
      month: isNaN(month) ? null : month,
      folio: isNaN(folio) ? null : folio,
    }
  } else {
    // Short format
    const folio = parseInt(parts[0] ?? '', 10)
    const year = 2000 + parseInt(parts[parts.length - 1] ?? '', 10)
    return {
      year: isNaN(year) ? null : year,
      month: null,
      folio: isNaN(folio) ? null : folio,
    }
  }
}

/**
 * Sorts an array of project-like objects by bitácora fields:
 *   year desc nulls last → month desc nulls last → folio desc nulls last → created_at desc
 */
export function sortByBitacora<T extends Record<string, any>>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const pa = parseBitacora(a.bitacora_number)
    const pb = parseBitacora(b.bitacora_number)

    // year desc, nulls last
    if (pa.year !== pb.year) {
      if (pa.year === null) return 1
      if (pb.year === null) return -1
      return pb.year - pa.year
    }

    // month desc, nulls last
    if (pa.month !== pb.month) {
      if (pa.month === null) return 1
      if (pb.month === null) return -1
      return pb.month - pa.month
    }

    // folio desc, nulls last
    if (pa.folio !== pb.folio) {
      if (pa.folio === null) return 1
      if (pb.folio === null) return -1
      return pb.folio - pa.folio
    }

    // created_at desc as tiebreaker
    const dateA: string = a.created_at ?? ''
    const dateB: string = b.created_at ?? ''
    return dateB.localeCompare(dateA)
  })
}
