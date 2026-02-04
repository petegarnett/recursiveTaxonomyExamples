import { defineType, defineField } from 'sanity'
import { TbCar } from 'react-icons/tb'

/**
 * Car schema - Example 1: Recursive parent-child structure
 * 
 * Cars can have a parent car (for hierarchical organization)
 * e.g., "Vehicles" -> "Sedans" -> "Compact Sedans"
 */
export const car = defineType({
  name: 'car',
  title: 'Car',
  type: 'document',
  icon: TbCar,
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
      name: 'parent',
      title: 'Parent',
      type: 'reference',
      to: [{ type: 'car' }],
      description: 'Select a parent car for hierarchical organization',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      parent: 'parent.title',
      media: 'image',
    },
    prepare({ title, parent, media }) {
      return {
        title,
        subtitle: parent ? `Parent: ${parent}` : 'Top level',
        media,
      }
    },
  },
})
