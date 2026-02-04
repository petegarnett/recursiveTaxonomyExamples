import groq from 'groq'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { DocumentStore, ListenQueryOptions, Path, pathToString } from 'sanity'
import type {
  Divider,
  ListItem,
  ListItemBuilder,
  StructureBuilder,
  StructureResolverContext,
} from 'sanity/structure'

import { TbSignRight } from 'react-icons/tb'
import { apiVersion } from '../../lib/env'

import { MenuItem } from '.'
import { childListItem } from './childList'
import { detailDocListItem } from './detailDocListItem'

// * * * fetch settings navigation * * *
/** This will fetch the navigation items from the atlasSettings document 2 levels in */
export function querySettingsNavigation({
  documentStore,
  S,
}: {
  documentStore: DocumentStore
  S: StructureBuilder
}): Observable<MenuItem[]> {
  const query = groq`*[_id == 'bikeSettings'][0].navigation[]{ _key, title, target->{_id, _type}, subNavigation[]{ _key, title, target->{_id, _type}, subNavigation } }`

  const options = {
    apiVersion,
    perspective: 'drafts',
    includeResult: true,
    tag: `navigation-query-atlasSettings`,
    throttleTime: 500, // throttle the query to avoid too many requests
  } as ListenQueryOptions

  return documentStore.listenQuery(query, {}, options)
}

// * * * fetch children * * *
/**  This will fetch all subNavigation items  */
export function queryChildren({
  documentStore,
  context,
  S,
  path,
}: {
  documentStore: DocumentStore
  context: StructureResolverContext
  S: StructureBuilder
  /** path for subNavigation query */
  path: Path
}): Observable<Array<ListItemBuilder | ListItem | Divider>> {
  // * Create a path to the navigation items
  const pathString = pathToString(path)

  // * Query only the subNavigation items for the given path
  const query =
    groq`*[_id == 'bikeSettings'][0].` +
    pathString +
    `.subNavigation[]{ _key, title, target->{_id, _type}, subNavigation }`

  return documentStore
    .listenQuery(
      query,
      {},
      {
        apiVersion,
        tag: `navigation-query-atlasSettings-${path.length}`,
        perspective: 'drafts',
        throttleTime: 500, // throttle the query to avoid too many requests
      },
    )
    .pipe(
      map<MenuItem[], ListItemBuilder[]>((menuItems) => {
        return menuItems.map((menuItem) => {
          const isNested = menuItem.subNavigation && menuItem.subNavigation.length > 0
          return isNested
            ? childListItem({ documentStore, context, S, nestedMenuItem: menuItem, path })
            : detailDocListItem(S, menuItem, TbSignRight)
        })
      }),
    )
}
