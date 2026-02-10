# Publishing Metadata - Fieldsets and Groups

This document explains the publishing metadata organization added to the Article schema, demonstrating how to use Sanity's **fieldsets** and **groups** to create a better content editing experience.

## What Was Added

The Article schema now includes organized publishing metadata fields that display in a clean, multi-column layout:

![Publishing Metadata Fieldset](./docs/publishing-metadata-screenshot.png)
*Publishing metadata fields displayed in a 3-column layout*

## Implementation

### 1. Fieldset Configuration

A **fieldset** groups related fields visually and can display them in columns:

```typescript
fieldsets: [
  {
    name: 'publishingMetadata',
    options: {
      columns: 3,  // Display fields in 3 columns
    },
  },
]
```

### 2. Group Configuration

A **group** creates a tab in the document editor to organize fields by category:

```typescript
groups: [
  {
    name: 'metadata',
  },
]
```

### 3. Fields Using Fieldset and Group

Three fields use both the fieldset and group:

```typescript
defineField({
  name: 'publishedDate',
  title: 'First Published',
  type: 'date',
  description: 'When the article was first published',
  fieldset: 'publishingMetadata',  // Links to the fieldset
  group: 'metadata',                // Links to the group
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
})
```

## Understanding Fieldsets vs Groups

### Fieldsets
- **Purpose**: Visual organization within a form
- **Layout**: Can display fields in columns (1-4 columns)
- **Use case**: Related fields that should appear together (dates, dimensions, pricing)
- **Visual**: Creates a bordered section with fields arranged horizontally

### Groups
- **Purpose**: Logical organization of the entire document
- **Layout**: Creates tabs at the top of the document editor
- **Use case**: Major sections of content (Content, Media, SEO, Metadata)
- **Visual**: Tab navigation at document level

## Benefits

1. **Visual Clarity**: Related fields are grouped together under a clear heading
2. **Space Efficiency**: Multi-column layout reduces scrolling
3. **Better UX**: Editors can quickly scan and fill related fields
4. **Logical Organization**: Separates content from metadata using groups
5. **Consistency**: Follows Sanity best practices for content modeling

## Common Fieldset Patterns

### Publishing Information (3 columns)
- Published date
- Updated date
- Reading time / Duration

### Dimensions (2-3 columns)
- Width
- Height
- Depth

### Pricing (2-3 columns)
- Price
- Sale price
- Currency

### Location (2 columns)
- Latitude
- Longitude

## Tips

- **Column count**: Use 2-4 columns depending on field width requirements
- **Field types**: Works best with narrow fields (dates, numbers, short text)
- **Responsive**: On smaller screens, columns stack automatically
- **Labels**: Keep field titles concise when using multiple columns
- **Descriptions**: Use field descriptions to provide context without cluttering the UI

## Example Output

When rendered, the fieldset creates a section titled "Publishing Metadata" with three fields displayed side-by-side:

```
Publishing Metadata
┌─────────────────────┬─────────────────────┬─────────────────────┐
│ First Published     │ Last Updated        │ Reading Time        │
│ When the article    │ When the article    │ Estimated reading   │
│ was first published │ was last updated    │ time in minutes     │
│ [date picker]       │ [date picker]       │ [number input]      │
└─────────────────────┴─────────────────────┴─────────────────────┘
```

This creates a professional, organized editing experience that editors will appreciate!
