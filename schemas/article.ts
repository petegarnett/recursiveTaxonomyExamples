import { defineType, defineField } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'
import { URL_PREFIXES } from '../lib/constants/urlPrefixes'

/**
 * Article schema - Demonstrates the async URL slug preview feature
 * Shows how to use dynamic URL prefixes that are built asynchronously
 */
export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  icon: DocumentTextIcon,
  fieldsets: [
    {
      name: 'publishingMetadata',
      options: {
        columns: 3,
      },
    },
  ],
  groups: [

    {
      name: 'metadata',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      description: 'Used to build the URL prefix (e.g., en-US/articles/)',
      options: {
        list: [
          { title: 'English (US)', value: 'en-US' },
          { title: 'Spanish', value: 'es' },
          { title: 'French', value: 'fr' },
          { title: 'German', value: 'de' },
        ],
      },
      initialValue: 'en-US',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'urlSlug',
      description: 'This field uses async URL prefix generation. The prefix will update automatically based on the language field.',
      options: {
        source: 'title',
        maxLength: 96,
        // This function will be called to generate the URL prefix
        urlPrefix: async (doc: any) => {
          // You can access any field from the document here
          return doc?.language ? `${doc.language}/articles/` : '/articles/'
        },
      },
      validation: (Rule) => Rule.required(),
    }),
     // PUBLISHING METADATA
     defineField({
      name: 'publishedDate',
      title: 'First Published',
      type: 'date',
      description: 'When the article was first published',
      fieldset: 'publishingMetadata',
      group: 'metadata',
    }),
    defineField({
      name: 'updatedDate',
      title: 'Last Updated',
      type: 'date',
      description: 'When the article was last updated',
      fieldset: 'publishingMetadata',
      group: 'metadata',
    }),
    defineField({
      name: 'readingTime',
      type: 'number',
      description: 'Estimated reading time in minutes',
      fieldset: 'publishingMetadata',
      group: 'metadata',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),

   
  ],
  preview: {
    select: {
      title: 'title',
      language: 'language',
      slug: 'slug.fullUrl',
    },
    prepare({ title, language, slug }) {
      return {
        title,
        subtitle: slug || `[${language}] No slug`,
      }
    },
  },
})
