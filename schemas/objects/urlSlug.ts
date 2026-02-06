import { defineField, defineType } from 'sanity'
import { LinkIcon } from '@sanity/icons'
import { AsyncUrlSlugInput } from '../../lib/components/AsyncUrlSlugInput/AsyncUrlSlugInput'

export const urlSlugObject = defineType({
  name: 'urlSlug',
  type: 'object',
  icon: LinkIcon,
  preview: {
    prepare({ current, fullUrl }) {
      return {
        title: current || 'No slug',
        subtitle: fullUrl || 'No URL',
      }
    },
    select: {
      current: 'current',
      fullUrl: 'fullUrl',
    },
  },
  components: {
    input: AsyncUrlSlugInput,
  },
  fields: [
    defineField({
      name: 'current',
      title: 'Slug',
      type: 'string',
      description: 'The URL-friendly version of the title',
      validation: (rule) => rule.required().error('Slug is required'),
    }),
    defineField({
      name: 'fullUrl',
      title: 'Full URL',
      type: 'string',
      description: 'The complete URL path including prefix',
      hidden: () => true,
      readOnly: () => true,
    }),
  ],
})
