import type { StructureResolver } from 'sanity/structure'


/**
 * Structure Builder Configuration
 *
 * This file demonstrates different approaches to content organization in Sanity Studio:
 *
 * 1. **Cars** - Recursive parent-child with document references
 *    - Documents reference other documents of the same type via `parent` field
 *    - Uses RxJS observables for reactive updates
 *    - Good for self-referencing hierarchies
 *
 * 2. **Bikes** - Settings-based navigation
 *    - Navigation defined in a singleton settings document
 *    - Nested arrays with references to target documents
 *    - Good for menu-driven navigation structures
 *
 * 3. **Clothing** - Simple category filter
 *    - Uses built-in `documentTypeList` with `.child()` and `.filter()`
 *    - No RxJS needed
 *    - Good for simple category → items relationships
 *
 * 4. **Articles** - Async URL slug preview
 *    - Custom input component with dynamic URL prefix generation
 *    - Live preview updates based on document fields (language)
 *    - Good for internationalized content with SEO-friendly URLs
 */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.divider(),

      // Default document lists for direct access
      S.documentTypeListItem('article').title('All Articles'),
    ])
