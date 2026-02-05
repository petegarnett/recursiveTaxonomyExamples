import type { SanityDocument } from '@sanity/client'
import { TbCar, TbDirections, TbSignRight, TbPlus } from 'react-icons/tb'
import { map } from 'rxjs/operators'
import type { ListBuilder, StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { createChildDraftMenuItem } from './createChildDraftMenuItem'
import { queryChildren, queryParents } from './queries'

const type = 'car'

/**
 * ## Example 1: Recursive parent-child structure (Cars)
 *
 * This structure displays a recursive list of parents with their children.
 * Based on a parent-child relationship between documents of the same type.
 * Uses observables to fetch and update children reactively.
 */
export const carsStructure = (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  const { documentStore } = context

  return S.listItem()
    .title('Cars (Recursive Parent-Child)')
    .icon(TbCar)
    .child(() => {
      const parents$ = queryParents({ documentStore, S, type })

      return parents$.pipe(
        map<SanityDocument[], ListBuilder>((documents) => {
          return S.list()
            .title('Car Categories')
            .items([
              // Create new top-level car (no parent)
              S.listItem()
                .title('➕ Create New Car')
                .icon(TbPlus)
                .child(
                  S.documentTypeList('car')
                    .title('All Cars')
                    .filter('_type == "car"')
                ),
              S.divider(),
              // Existing cars hierarchy
              ...documents.map((parent) => {
                const hasChildren = parent.children

                return hasChildren
                  ? S.listItem()
                      .schemaType(parent._type || type)
                      .icon(TbDirections)
                      .id(parent._id)
                      .title(parent.title || 'Untitled')
                      .child(() => {
                        const childPages$ = queryChildren({
                          documentStore,
                          S,
                          context,
                          parentId: parent._id,
                          type,
                        })

                        return childPages$.pipe(
                          map((childItems) => {
                            return S.list()
                              .title(`${parent.title} - Children`)
                              .canHandleIntent(
                                (intentName, params) =>
                                  intentName === 'edit' && params.type === type,
                              )
                              .items([
                                // Parent document
                                S.listItem()
                                  .title(`Edit: ${parent.title}`)
                                  .icon(TbSignRight)
                                  .child(
                                    S.document()
                                      .schemaType(type)
                                      .documentId(parent._id)
                                  ),
                                S.divider(),
                                // Children
                                ...(Array.isArray(childItems) ? childItems : [childItems]),
                              ])
                              .menuItems([
                                createChildDraftMenuItem({
                                  S,
                                  context,
                                  parent,
                                  type,
                                }),
                              ])
                          }),
                        )
                      })
                  : S.documentListItem()
                      .schemaType(parent._type || type)
                      .id(parent._id)
                      .title(parent.title || 'Untitled')
                      .icon(TbSignRight)
              }),
            ])
        }),
      )
    })
}
