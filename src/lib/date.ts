import { format, parseISO, isValid, addDays, startOfDay, endOfDay } from 'date-fns'
import { fr } from 'date-fns/locale'

/**
 * Format date for display in French locale
 */
export function formatDate(date: Date | string, formatStr: string = 'dd/MM/yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (!isValid(dateObj)) {
    return 'Date invalide'
  }
  
  return format(dateObj, formatStr, { locale: fr })
}

/**
 * Format date and time for display
 */
export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'dd/MM/yyyy à HH:mm')
}

/**
 * Format date for form inputs (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (!isValid(dateObj)) {
    return ''
  }
  
  return format(dateObj, 'yyyy-MM-dd')
}

/**
 * Format datetime for form inputs (YYYY-MM-DDTHH:mm)
 */
export function formatDateTimeForInput(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (!isValid(dateObj)) {
    return ''
  }
  
  return format(dateObj, "yyyy-MM-dd'T'HH:mm")
}

/**
 * Get start and end of day for date range queries
 */
export function getDayRange(date: Date | string): { start: Date; end: Date } {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  return {
    start: startOfDay(dateObj),
    end: endOfDay(dateObj)
  }
}

/**
 * Add business days (excluding weekends)
 */
export function addBusinessDays(date: Date, days: number): Date {
  let result = new Date(date)
  let addedDays = 0
  
  while (addedDays < days) {
    result = addDays(result, 1)
    
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      addedDays++
    }
  }
  
  return result
}

/**
 * Check if date is in the future
 */
export function isFutureDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const now = new Date()
  
  return isValid(dateObj) && dateObj > now
}

/**
 * Get relative time description (e.g., "dans 2 jours", "il y a 3 heures")
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (!isValid(dateObj)) {
    return 'Date invalide'
  }
  
  const now = new Date()
  const diffMs = dateObj.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.ceil(diffMs / (1000 * 60))
  
  if (Math.abs(diffDays) >= 1) {
    return diffDays > 0 ? `dans ${diffDays} jour${diffDays > 1 ? 's' : ''}` : `il y a ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`
  } else if (Math.abs(diffHours) >= 1) {
    return diffHours > 0 ? `dans ${diffHours} heure${diffHours > 1 ? 's' : ''}` : `il y a ${Math.abs(diffHours)} heure${Math.abs(diffHours) > 1 ? 's' : ''}`
  } else {
    return diffMinutes > 0 ? `dans ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}` : `il y a ${Math.abs(diffMinutes)} minute${Math.abs(diffMinutes) > 1 ? 's' : ''}`
  }
}