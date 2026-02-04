import { TbShirt } from 'react-icons/tb'
import type { StructureBuilder } from 'sanity/structure'

/**
 * ## Example 3: Simple Parent-Child Structure (Clothing)
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
 */
export const clothingStructure = (S: StructureBuilder) => {
  return S.listItem()
    .title('Clothing (Simple Filter)')
    .icon(TbShirt)
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
