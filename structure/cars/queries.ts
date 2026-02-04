import groq from 'groq'
import type { SanityDocument } from '@sanity/client'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { DocumentStore, ListenQueryOptions } from 'sanity'
import type {
  ListItemBuilder,
  StructureBuilder,
  StructureResolverContext,
} from 'sanity/structure'

import { TbSignRight } from 'react-icons/tb'
import { apiVersion } from '../../lib/env'
import { detailDocListItem } from './detailDocListItem'

// * * * fetch parent documents * * *
/** 
 * Fetches all top-level documents (documents with no parent reference)
 * Also includes a flag indicating if the document has children
 */
export function queryParents({
  documentStore,
  S,
  type,
}: {
  documentStore: DocumentStore
  S: StructureBuilder
  type: string
}): Observable<SanityDocument[]> {
  // Query for documents that have no parent (top-level items)
  // Also check if they have children by looking for documents that reference them
  const query = groq`*[_type == $type && !defined(parent)] {
    ...,
    "children": count(*[_type == $type && parent._ref == ^._id]) > 0
  } | order(title asc)`

  const options: ListenQueryOptions = {
    apiVersion,
    perspective: 'drafts',
    tag: `parent-query-${type}`,
    throttleTime: 500,
  }

  return documentStore.listenQuery(query, { type }, options)
}

// * * * fetch child documents * * *
/** 
 * Fetches all child documents for a given parent ID
 * Returns ListItemBuilders for use in the structure
 */
export function queryChildren({
  documentStore,
  S,
  context,
  parentId,
  type,
}: {
  documentStore: DocumentStore
  S: StructureBuilder
  context: StructureResolverContext
  parentId: string
  type: string
}): Observable<ListItemBuilder[]> {
  // Query for documents that reference the parent
  // Also check if each child has its own children (for recursive nesting)
  const query = groq`*[_type == $type && parent._ref == $parentId] {
    ...,
    "children": count(*[_type == $type && parent._ref == ^._id]) > 0
  } | order(title asc)`

  const options: ListenQueryOptions = {
    apiVersion,
    perspective: 'drafts',
    tag: `children-query-${type}-${parentId}`,
    throttleTime: 500,
  }

  return documentStore.listenQuery(query, { type, parentId }, options).pipe(
    map<SanityDocument[], ListItemBuilder[]>((children) => {
      return children.map((child) => {
        // For documents with children, we could recursively nest here
        // For now, return a simple list item that opens the document
        return S.documentListItem()
          .schemaType(child._type || type)
          .id(child._id)
          .title(child.title || 'Untitled')
          .icon(TbSignRight)
      })
    }),
  )
}
