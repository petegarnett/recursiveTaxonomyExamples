import type { StructureBuilder } from 'sanity/structure'

/**
 * ## Simple Parent-Child Structure
 * 
 * This is the simplest approach to showing documents filtered by a parent category.
 * 
 * Pattern:
 * 1. Show a list of categories
 * 2. When a category is selected, show all items that reference that category
 * 
 * ### Pros:
 * - Simple and straightforward
 * - No RxJS/observables needed
 * - Good performance
 * - Built-in Sanity filtering
 * 
 * ### Cons:
 * - Only one level of nesting (not truly recursive)
 * - Requires a reference field on child documents
 * 
 */
export const simpleParentChildStructure = (S: StructureBuilder) => {
  return S.listItem()
    .title('Clothing by Category')
    .child(
      S.documentTypeList('clothingCategory')
        .title('Clothing Categories')
        .child((categoryId) =>
          S.documentTypeList('clothing')
            .title('Clothing Items')
            .apiVersion('2024-01-01')
            .filter('_type == "clothing" && category._ref == $categoryId')
            .params({ categoryId })
        )
    )
}
