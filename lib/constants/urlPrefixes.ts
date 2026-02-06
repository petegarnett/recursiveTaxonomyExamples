/**
 * Centralized URL prefix mapping for different document types.
 *
 * These functions generate URL prefixes based on document data, ensuring
 * consistent URL structure across the CMS.
 */

type BikeDocument = {
  // Add any fields you want to use in the URL prefix
  // For example: language?: string
}

type CarDocument = {
  // Add any fields you want to use in the URL prefix
}

type ClothingDocument = {
  // Add any fields you want to use in the URL prefix
}

/**
 * URL prefix configuration for each supported document type.
 * Each function receives the document data and returns the URL prefix.
 *
 * @example
 * // Static prefix
 * bike: async () => '/bikes/'
 *
 * @example
 * // Dynamic prefix based on document fields
 * bike: async (document: BikeDocument) => {
 *   return document?.language ? `${document.language}/bikes/` : '/bikes/'
 * }
 */
export const URL_PREFIXES = {
  bike: async (document: BikeDocument) => {
    // Simple static prefix - you can make this dynamic based on document fields
    return '/bikes/'
  },
  car: async (document: CarDocument) => {
    return '/cars/'
  },
  clothing: async (document: ClothingDocument) => {
    return '/clothing/'
  },
} as const

export type DocumentTypeWithUrlPrefix = keyof typeof URL_PREFIXES
