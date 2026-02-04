import { TbDirections, TbSignRight } from 'react-icons/tb'
import { map } from 'rxjs/operators'
import { DocumentStore, Path } from 'sanity'
import type { StructureBuilder, StructureResolverContext } from 'sanity/structure'

import { MenuItem } from '.'
import { detailDocListItem } from './detailDocListItem'
import { queryChildren } from './queries'

/** `childListItem` will fetch and listen to nested menu items and render them out recursively */
export const childListItem = ({
  nestedMenuItem,
  documentStore,
  context,
  S,
  path,
}: {
  documentStore: DocumentStore
  context: StructureResolverContext
  nestedMenuItem: MenuItem
  S: StructureBuilder
  path: Path
}) => {
  const isNested = nestedMenuItem.subNavigation && nestedMenuItem.subNavigation.length > 0

  // * Create a path to the nested menu item
  // This will be used to fetch the children of the nested menu item
  const nestedPath = [...path, 'subNavigation', { _key: nestedMenuItem._key }] as Path
  // * Create a unique id for the list item
  const id = nestedMenuItem._key + '-' + nestedPath.length

  return isNested
    ? S.listItem()
        .id(id)
        .title(nestedMenuItem.title)
        .icon(TbDirections)
        .child(() => {
          const childNavigation$ = queryChildren({ documentStore, context, S, path: nestedPath })

          return childNavigation$.pipe(
            map((childNavs) => {
              return S.list().title(nestedMenuItem.title).items(childNavs)
            }),
          )
        })
    : detailDocListItem(S, nestedMenuItem, TbSignRight)
}
