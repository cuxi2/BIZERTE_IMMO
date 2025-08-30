/**
 * Convert a string to a URL-friendly slug
 * Handles French accents and special characters
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/\p{Diacritic}/gu, '') // Remove diacritics (accents)
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/(^-|-$)+/g, '') // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by appending a number if needed
 */
export function generateUniqueSlug(
  baseText: string, 
  existingSlugs: string[] = []
): string {
  const baseSlug = toSlug(baseText)
  
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug
  }
  
  let counter = 1
  let uniqueSlug = `${baseSlug}-${counter}`
  
  while (existingSlugs.includes(uniqueSlug)) {
    counter++
    uniqueSlug = `${baseSlug}-${counter}`
  }
  
  return uniqueSlug
}

/**
 * Extract slug from URL path
 */
export function extractSlugFromPath(path: string): string {
  const segments = path.split('/')
  return segments[segments.length - 1] || ''
}