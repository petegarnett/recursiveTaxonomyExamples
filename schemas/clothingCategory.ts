import { defineType, defineField } from 'sanity'
import { TbCategory } from 'react-icons/tb'

/**
 * Clothing Category schema - Example 3: Simple parent-child filter
 * 
 * Categories for organizing clothing items
 */
export const clothingCategory = defineType({
  name: 'clothingCategory',
  title: 'Clothing Category',
  type: 'document',
  icon: TbCategory,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
