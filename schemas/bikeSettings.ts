import { defineType, defineField, defineArrayMember } from 'sanity'
import { TbSettings, TbBike } from 'react-icons/tb'

/**
 * MenuItem type for nested navigation
 */
const menuItem = defineArrayMember({
  name: 'menuItem',
  title: 'Menu Item',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'target',
      title: 'Target',
      type: 'reference',
      to: [{ type: 'bike' }],
    }),
    defineField({
      name: 'subNavigation',
      title: 'Sub Navigation',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'subMenuItem',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'target',
              title: 'Target',
              type: 'reference',
              to: [{ type: 'bike' }],
            }),
            defineField({
              name: 'subNavigation',
              title: 'Sub Navigation',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'deepSubMenuItem',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Title',
                      type: 'string',
                    }),
                    defineField({
                      name: 'target',
                      title: 'Target',
                      type: 'reference',
                      to: [{ type: 'bike' }],
                    }),
                  ],
                },
              ],
            }),
          ],
        },
      ],
    }),
  ],
})

/**
 * Bike Settings schema - Example 2: Settings-based navigation
 * 
 * A singleton document that defines the navigation structure for bikes
 * Navigation is defined as nested arrays rather than document references
 */
export const bikeSettings = defineType({
  name: 'bikeSettings',
  title: 'Bike Settings',
  type: 'document',
  icon: TbSettings,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Bike Navigation Settings',
    }),
    defineField({
      name: 'navigation',
      title: 'Navigation',
      type: 'array',
      of: [menuItem],
      description: 'Define the navigation structure for bikes',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Bike Settings',
        subtitle: 'Navigation configuration',
      }
    },
  },
})
