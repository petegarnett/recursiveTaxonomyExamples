import type { ReactNode } from 'react'
import { IconType } from 'react-icons/lib'
import { TbSignRight } from 'react-icons/tb'
import type { StructureBuilder } from 'sanity/structure'
import { MenuItem } from '.'
import ReadView from '../../../components/shared/views/reader/ReadView'

/** This will render out a single document list item for un-nested menu items */
export const detailDocListItem = (
  S: StructureBuilder,
  menuItem: MenuItem,
  icon?: IconType | ReactNode,
) =>
  S.listItem()
    .title(menuItem.title || '')
    .id(`${menuItem._key}-${menuItem.target?._id}` || '')
    .icon(icon || TbSignRight)
    .child(
      S.document()
        .schemaType(menuItem.target?._type || '')
        .documentId(menuItem.target?._id || '')
        .views([S.view.form(), S.view.component(ReadView).title('Reader')]),
    )
