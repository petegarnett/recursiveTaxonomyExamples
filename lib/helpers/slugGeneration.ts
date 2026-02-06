import { sanitySlugify } from './slugify'

export interface UrlSlugValue {
  current?: string
  fullUrl?: string
}

export interface SlugGenerationOptions {
  urlPrefix?: string | ((document: any) => Promise<string> | string)
  source?: string
  maxLength?: number
}

/**
 * Resolves the URL prefix from options
 * @param document - The document to generate prefix for
 * @param options - Slug generation options
 * @returns The resolved prefix string
 */
export async function resolveUrlPrefix(
  document: any,
  options: SlugGenerationOptions,
): Promise<string> {
  if (!document || !document._id) {
    return ''
  }

  if (typeof options?.urlPrefix === 'string') {
    return options.urlPrefix
  }

  if (typeof options?.urlPrefix === 'function') {
    const value = await Promise.resolve(options.urlPrefix(document))
    return value as string
  }

  return ''
}

/**
 * Formats a URL prefix to ensure it ends with /
 * @param prefix - The URL prefix
 * @returns Formatted prefix
 */
export function formatUrlPrefix(prefix: string): string {
  if (!prefix) return ''

  return `${prefix}${
    !prefix.endsWith('/') && !prefix.includes('#') && !prefix.includes('?') ? '/' : ''
  }`
}

/**
 * Formats and slugifies an input string
 * @param input - The string to slugify
 * @param maxLength - Optional maximum length
 * @returns Slugified string
 */
export function formatSlugString(input: string, maxLength?: number): string {
  let finalSlug = input || ''

  finalSlug = finalSlug
    .split('/')
    .filter((segment) => !!segment)
    .map((segment) => sanitySlugify(segment))
    .join('/')

  // Apply maxLength if specified
  if (maxLength && finalSlug.length > maxLength) {
    finalSlug = finalSlug.substring(0, maxLength)
  }

  return finalSlug
}

/**
 * Generates a complete URL slug object for a document
 * @param document - The document to generate slug for
 * @param options - Slug generation options
 * @returns URL slug object with current and fullUrl
 */
export async function generateUrlSlug(
  document: any,
  options: SlugGenerationOptions,
): Promise<UrlSlugValue> {
  // Get source value
  const sourceValue = options.source ? document[options.source] : ''

  if (!sourceValue) {
    return { current: '', fullUrl: '' }
  }

  // Slugify the source
  const slugValue = formatSlugString(sourceValue, options.maxLength)

  // Resolve and format prefix
  const prefix = await resolveUrlPrefix(document, options)
  const finalPrefix = formatUrlPrefix(prefix)

  return {
    current: slugValue,
    fullUrl: finalPrefix ? `${finalPrefix}${slugValue}` : slugValue,
  }
}

/**
 * Creates a URL slug value from a current slug and prefix
 * @param currentSlug - The slug value
 * @param prefix - The URL prefix (will be formatted)
 * @returns URL slug object
 */
export function createUrlSlugValue(currentSlug: string, prefix: string): UrlSlugValue {
  const finalPrefix = formatUrlPrefix(prefix)

  return {
    current: currentSlug,
    fullUrl: finalPrefix ? `${finalPrefix}${currentSlug}` : currentSlug,
  }
}
