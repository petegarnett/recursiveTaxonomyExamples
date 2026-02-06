# Async URL Slug Preview Feature

> **Note**: This is a simplified, standalone example extracted from Sanetti 3. The internationalization implementation shown here uses a basic `language` field for demonstration. For production use with Sanity's document internationalization plugin, see the [Important: Simplified Internationalization](#important-simplified-internationalization) section below.

This project includes a custom Sanity input component that provides dynamic URL prefix generation with live preview. The prefix updates automatically based on document fields (like language, category, etc.).

## What It Does

Instead of showing just a slug field like this:
```
embracing-the-future-of-cycling
```

It shows a complete URL with a dynamic prefix:
```
[en-US/articles/] embracing-the-future-of-cycling
```

The prefix (`en-US/articles/`) is generated asynchronously based on the document's fields and updates in real-time when those fields change.

## Files Added

### Core Logic
- `lib/helpers/slugify.ts` - Slugification functions
- `lib/helpers/slugGeneration.ts` - URL slug generation and prefix resolution
- `lib/constants/urlPrefixes.ts` - URL prefix configuration per document type

### UI Components
- `lib/components/AsyncUrlSlugInput/AsyncUrlSlugInput.tsx` - Custom input component
- `lib/components/AsyncUrlSlugInput/useAsyncUrlSlugLogic.ts` - React hook for slug logic

### Schema Types
- `schemas/objects/urlSlug.ts` - Custom `urlSlug` object type
- `schemas/article.ts` - Example document using the feature

## How to Use

### 1. Define URL Prefixes

Edit `lib/constants/urlPrefixes.ts` to define prefixes for your document types:

```typescript
export const URL_PREFIXES = {
  article: async (document: ArticleDocument) => {
    // Dynamic prefix based on document fields
    return document?.language ? `${document.language}/articles/` : '/articles/'
  },
  product: async (document: ProductDocument) => {
    // You can use any document field
    return document?.category
      ? `${document.language}/shop/${document.category}/`
      : `${document.language}/shop/`
  },
}
```

### 2. Use the `urlSlug` Type in Your Schema

```typescript
import { defineType, defineField } from 'sanity'

export const myDocument = defineType({
  name: 'myDocument',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    // Note: This is a simplified language field for demo purposes
    // For production, use Sanity's i18n plugin (see section below)
    defineField({
      name: 'language',
      type: 'string',
      options: {
        list: [
          { title: 'English', value: 'en-US' },
          { title: 'Spanish', value: 'es' },
        ],
      },
    }),
    defineField({
      name: 'slug',
      type: 'urlSlug', // Use the custom urlSlug type
      options: {
        source: 'title', // Generate slug from this field
        maxLength: 96,
        // Define how to generate the URL prefix
        urlPrefix: async (doc: any) => {
          return doc?.language ? `${doc.language}/articles/` : '/articles/'
        },
      },
    }),
  ],
})
```

### 3. The Component Does the Rest

The `AsyncUrlSlugInput` component will:
- Show a loading state while fetching the prefix
- Display the prefix in a grey box
- Show the slug input field
- Provide a "Generate" button to auto-create slugs
- Update the `fullUrl` field automatically with the complete URL

## Features

### Loading States
The component shows a loading spinner while the prefix is being generated asynchronously.

### Error Handling
If prefix generation fails, an error indicator is shown with details in a tooltip.

### Auto-Generation
Click the "Generate" button to automatically create a slug from the source field (e.g., title).

### Full URL Tracking
The component maintains both:
- `current` - Just the slug part (e.g., `embracing-the-future-of-cycling`)
- `fullUrl` - Complete URL with prefix (e.g., `en-US/articles/embracing-the-future-of-cycling`)

### Reactive Updates
When you change fields that affect the prefix (like language or category), the prefix updates automatically.

## Example: Article Document

See `schemas/article.ts` for a complete example. It includes:
- A `language` field that affects the URL prefix
- A `slug` field using the `urlSlug` type
- Configuration for async prefix generation
- Preview configuration showing the full URL

## Testing It Out

1. Start the Studio: `npm run dev`
2. Create a new Article document
3. Enter a title (e.g., "Hello World")
4. Select a language (e.g., "English (US)")
5. Click "Generate" next to the slug field
6. Watch the prefix update: `en-US/articles/hello-world`
7. Change the language to "Spanish"
8. The prefix automatically updates to: `es/articles/hello-world`

## Customization

### Add More Document Types

Add entries to `lib/constants/urlPrefixes.ts`:

```typescript
export const URL_PREFIXES = {
  article: async (doc) => `${doc?.language}/articles/`,
  page: async (doc) => `${doc?.language}/`,
  product: async (doc) => `${doc?.language}/shop/`,
  // Add more...
} as const
```

### Customize the Slugify Function

Edit `lib/helpers/slugify.ts` to change how slugs are generated:

```typescript
export const cleanSlug = (input: string, prefix?: string): string => {
  // Customize the slug generation logic here
  const cleanInput = input
    .toLowerCase()
    .replace(/[custom-chars]/g, '')
    // ... your custom logic

  return prefix ? `${prefix}/${cleanInput}` : cleanInput
}
```

### Style the Component

Edit `lib/components/AsyncUrlSlugInput/AsyncUrlSlugInput.tsx` to customize the appearance:

```typescript
const UrlPrefix = styled(Card)`
  // Your custom styles
  background-color: #f0f0f0;
  border-radius: 4px;
  // ...
`
```

## Important: Simplified Internationalization

⚠️ **This is a simplified example** - The `language` field shown here is a basic string field for demonstration purposes. In production applications using Sanity's document internationalization, you should integrate with the official i18n plugin instead.

### What's Simplified in This Example

In the example `article.ts` schema, the language field is manually defined:

```typescript
defineField({
  name: 'language',
  title: 'Language',
  type: 'string',
  options: {
    list: [
      { title: 'English (US)', value: 'en-US' },
      { title: 'Spanish', value: 'es' },
    ],
  },
})
```

This works for the URL slug preview feature, but it's **not** a complete internationalization solution.

### Production-Ready Internationalization

For a proper i18n implementation (as seen in Sanetti 3), you should:

1. **Install the Document Internationalization Plugin**
   ```bash
   npm install @sanity/document-internationalization
   ```

2. **Configure the plugin in your Sanity config**
   ```typescript
   import {documentInternationalization} from '@sanity/document-internationalization'

   export default defineConfig({
     plugins: [
       documentInternationalization({
         supportedLanguages: [
           {id: 'en-US', title: 'English (US)'},
           {id: 'es', title: 'Spanish'},
           {id: 'fr', title: 'French'},
           {id: 'de', title: 'German'},
         ],
         schemaTypes: ['article', 'page', 'product'],
       }),
     ],
   })
   ```

3. **Use a standardized language field**

   Instead of manually defining the language field, create a reusable field definition:

   ```typescript
   // lib/fields/languageField.ts
   import {defineField} from 'sanity'

   export const languageField = defineField({
     name: 'language',
     type: 'string',
     hidden: true,      // Managed by i18n plugin
     readOnly: true,    // Managed by i18n plugin
   })
   ```

   Then use it in your schemas:

   ```typescript
   import {languageField} from '../lib/fields/languageField'

   export const article = defineType({
     name: 'article',
     fields: [
       languageField,  // Add as first field
       // ... other fields
     ],
   })
   ```

4. **Benefits of the Full i18n Plugin**
   - **Translation UI**: Built-in interface for managing translations
   - **Translation references**: Automatic linking between language versions
   - **Translation metadata**: Track translation status and updates
   - **Language-specific queries**: Filter content by language in GROQ
   - **Translation workflows**: Manage translation states (draft, in-review, published)

### How It Works Together

The async URL slug feature works seamlessly with Sanity's i18n plugin:

1. The i18n plugin manages the `language` field automatically
2. Your URL prefix function reads from `document.language`
3. The prefix updates when the language changes
4. Full URLs include the language code (e.g., `en-US/articles/hello-world`)

### Migration Path

If you start with this simplified example and later need full i18n:

1. Install and configure the `@sanity/document-internationalization` plugin
2. Replace the manual `language` field with the `languageField` definition
3. Migrate existing documents to use the i18n plugin's language structure
4. Your URL slug logic will continue to work without changes

The URL prefix generation functions work with either approach, making this feature i18n-ready from the start.

## Source

This feature was extracted from the Sanetti 3 project's URL slug handling system and adapted for standalone use.
