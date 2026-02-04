import { defineType, defineField } from 'sanity'
import { TbShirt } from 'react-icons/tb'

/**
 * Clothing schema - Example 3: Simple parent-child filter
 * 
 * Clothing items that reference a category
 */
export const clothing = defineType({
  name: 'clothing',
  title: 'Clothing',
  type: 'document',
  icon: TbShirt,
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
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'clothingCategory' }],
      validation: (Rule) => Rule.required(),
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
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'XS', value: 'xs' },
          { title: 'S', value: 's' },
          { title: 'M', value: 'm' },
          { title: 'L', value: 'l' },
          { title: 'XL', value: 'xl' },
          { title: 'XXL', value: 'xxl' },
        ],
      },
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
      category: 'category.title',
      price: 'price',
      media: 'image',
    },
    prepare({ title, category, price, media }) {
      return {
        title,
        subtitle: [category, price ? `$${price}` : null].filter(Boolean).join(' • '),
        media,
      }
    },
  },
})
