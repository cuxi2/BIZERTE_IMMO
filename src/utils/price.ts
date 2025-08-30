/**
 * Format price for display with currency
 */
export function formatPrice(price: number, currency: string = 'TND'): string {
  // Format number with thousand separators
  const formattedNumber = new Intl.NumberFormat('fr-TN').format(price)
  
  return `${formattedNumber} ${currency}`
}

/**
 * Format price range for display
 */
export function formatPriceRange(
  minPrice: number, 
  maxPrice: number, 
  currency: string = 'TND'
): string {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice, currency)
  }
  
  return `${formatPrice(minPrice, currency)} - ${formatPrice(maxPrice, currency)}`
}

/**
 * Parse price string to number (remove currency and separators)
 */
export function parsePrice(priceString: string): number {
  return parseFloat(priceString.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
}

/**
 * Calculate monthly payment for loans (rough estimation)
 */
export function calculateMonthlyPayment(
  price: number, 
  downPayment: number = 0, 
  interestRate: number = 0.07, 
  years: number = 20
): number {
  const principal = price - downPayment
  const monthlyRate = interestRate / 12
  const numberOfPayments = years * 12
  
  if (monthlyRate === 0) {
    return principal / numberOfPayments
  }
  
  const monthlyPayment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  
  return Math.round(monthlyPayment)
}

/**
 * Get price per square meter
 */
export function getPricePerM2(price: number, areaM2: number): number {
  if (areaM2 <= 0) return 0
  return Math.round(price / areaM2)
}

/**
 * Format area for display
 */
export function formatArea(areaM2: number): string {
  return `${areaM2} m²`
}

/**
 * Validate price range
 */
export function isValidPriceRange(minPrice: number, maxPrice: number): boolean {
  return minPrice >= 0 && maxPrice >= minPrice
}