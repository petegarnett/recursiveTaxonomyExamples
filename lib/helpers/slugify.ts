/**
 * Custom slugify function that properly handles apostrophes and other special characters
 * @param input - The string to slugify
 * @returns A URL-friendly slug
 */
export const cleanSlug = (input: string, prefix?: string): string => {
  const cleanInput = input
    .toLowerCase()
    .normalize('NFD') // Normalize to decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks (accents)
    .replace(/'/g, '') // Remove apostrophes
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens

  return prefix ? `${prefix}/${cleanInput}` : cleanInput
}

/**
 * Sanity-compatible slugify function that uses cleanSlug internally
 * @param input - The string to slugify
 * @param schemaType - Sanity schema type (ignored, for compatibility)
 * @returns A URL-friendly slug
 */
export const sanitySlugify = (input: string, schemaType?: unknown): string => {
  return cleanSlug(input)
}

/**
 * Creates a path-based slug that preserves path segments while only slugifying the final segment
 * @param input - Path-like string where only the last segment should be slugified (e.g., "en-US/store/Product Title")
 * @returns A URL-friendly path slug (e.g., "en-US/store/product-title")
 */
export const createPathSlug = (input: string): string => {
  // Split by '/' to separate path segments
  const segments = input.split('/')

  if (segments.length === 1) {
    // No path separators, just clean the whole string
    return cleanSlug(segments[0] || '')
  }

  // Take all segments except the last as prefix, slugify only the last segment
  const pathPrefix = segments.slice(0, -1)
  const titleSegment = segments[segments.length - 1] || ''
  const cleanedTitle = cleanSlug(titleSegment)

  return `${pathPrefix.join('/')}/${cleanedTitle}`
}
