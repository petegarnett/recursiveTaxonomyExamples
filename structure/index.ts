import type { StructureResolver } from 'sanity/structure'
import { carsStructure } from './cars'
import { bikesStructure } from './bikes'
import { clothingStructure } from './clothing'

/**
 * Structure Builder Configuration
 * 
 * This file demonstrates three different approaches to recursive/hierarchical
 * document structures in Sanity Studio:
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
 */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      // Example 1: Recursive parent-child (Cars)
      carsStructure(S, context),
      
      S.divider(),
      
      // Example 2: Settings-based navigation (Bikes)
      bikesStructure(S, context),
      // Bike Settings singleton
      S.listItem()
        .title('Bike Settings')
        .child(
          S.document()
            .schemaType('bikeSettings')
            .documentId('bikeSettings')
        ),
      
      S.divider(),
      
      // Example 3: Simple category filter (Clothing)
      clothingStructure(S),
      
      S.divider(),
      
      // Default document lists for direct access
      S.documentTypeListItem('car').title('All Cars'),
      S.documentTypeListItem('bike').title('All Bikes'),
      S.documentTypeListItem('clothing').title('All Clothing'),
      S.documentTypeListItem('clothingCategory').title('All Clothing Categories'),
    ])
