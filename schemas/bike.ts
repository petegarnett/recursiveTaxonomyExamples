import { defineType, defineField } from 'sanity'
import { TbBike } from 'react-icons/tb'

/**
 * Bike schema - Example 2: Target documents for settings-based navigation
 */
export const bike = defineType({
  name: 'bike',
  title: 'Bike',
  type: 'document',
  icon: TbBike,
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
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
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
      price: 'price',
      media: 'image',
    },
    prepare({ title, price, media }) {
      return {
        title,
        subtitle: price ? `$${price}` : undefined,
        media,
      }
    },
  },
})
