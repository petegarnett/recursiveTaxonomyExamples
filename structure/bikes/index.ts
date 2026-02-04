import { TbBike, TbDirections, TbSignRight } from 'react-icons/tb'
import { map } from 'rxjs/operators'
import { Path } from 'sanity'
import {
  type ListBuilder,
  type StructureBuilder,
  type StructureResolverContext,
} from 'sanity/structure'
import { childListItem } from './childList'
import { detailDocListItem } from './detailDocListItem'
import { querySettingsNavigation } from './queries'

/**
 * ## MenuItem interface
 */
export interface MenuItem {
  _key: string
  title: string
  target?: {
    _id: string
    _type: string
  }
  subNavigation?: MenuItem[]
}

/**
 * ## Example 2: Recursive taxonomy navigational structure (Bikes)
 *
 * This structure displays a recursive list of menu items based on the `bikeSettings` document.
 * Navigation is defined in a singleton settings document with nested arrays.
 */
export const bikesStructure = (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  const { documentStore } = context
  const startPath = ['navigation'] as Path

  return S.listItem()
    .title('Bikes (Settings Navigation)')
    .icon(TbBike)
    .child(() => {
      const navigation$ = querySettingsNavigation({ documentStore, S })

      return navigation$.pipe(
        map<MenuItem[], ListBuilder>((documents) => {
          if (!documents || documents.length === 0) {
            return S.list().title('No navigation items found. Edit Bike Settings to add navigation.')
          }
          return S.list()
            .title('Bike Navigation')
            .items(
              documents.map((menuItem, index) => {
                const isNested = menuItem.subNavigation && menuItem.subNavigation.length > 0
                const path = [...startPath, { _key: menuItem._key }] as Path
                const id = `${menuItem._key}-${index}`

                return isNested
                  ? S.listItem()
                      .id(id)
                      .title(menuItem.title)
                      .icon(TbDirections)
                      .child(
                        S.list()
                          .title(menuItem.title)
                          .items(
                            menuItem.subNavigation?.map((nestedMenuItem: MenuItem) => {
                              return childListItem({
                                path,
                                nestedMenuItem,
                                documentStore,
                                context,
                                S,
                              })
                            }) || [],
                          ),
                      )
                  : detailDocListItem(S, menuItem, TbSignRight)
              }),
            )
        }),
      )
    })
}
