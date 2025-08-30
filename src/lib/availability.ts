import { isBefore, isAfter, parseISO, isValid } from 'date-fns'

/**
 * Check if two date ranges overlap
 */
export function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return !(isBefore(aEnd, bStart) || isAfter(aStart, bEnd))
}

/**
 * Check if a new booking period is available (doesn't conflict with existing reservations)
 */
export function canBook(
  existingReservations: { start_date: string; end_date: string }[], 
  startDate: Date, 
  endDate: Date
): boolean {
  return existingReservations.every(reservation => {
    const reservationStart = parseISO(reservation.start_date)
    const reservationEnd = parseISO(reservation.end_date)
    
    // Skip invalid dates
    if (!isValid(reservationStart) || !isValid(reservationEnd)) {
      return true
    }
    
    return !overlaps(reservationStart, reservationEnd, startDate, endDate)
  })
}

/**
 * Get unavailable date ranges for a listing (for calendar display)
 */
export function getUnavailableDates(
  reservations: { start_date: string; end_date: string; status: string }[]
): { start: Date; end: Date }[] {
  return reservations
    .filter(r => r.status === 'confirmed' || r.status === 'pending')
    .map(r => ({
      start: parseISO(r.start_date),
      end: parseISO(r.end_date)
    }))
    .filter(({ start, end }) => isValid(start) && isValid(end))
}

/**
 * Check if a specific date is available
 */
export function isDateAvailable(
  date: Date,
  reservations: { start_date: string; end_date: string; status: string }[]
): boolean {
  const unavailablePeriods = getUnavailableDates(reservations)
  
  return !unavailablePeriods.some(({ start, end }) => {
    return (date >= start && date <= end)
  })
}