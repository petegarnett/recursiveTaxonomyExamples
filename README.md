# Sanity Studio Examples

This project demonstrates advanced Sanity Studio patterns and custom input components. Currently focused on the **Async URL Slug Preview** feature, with recursive taxonomy examples coming soon.

## Current Example: Async URL Slug Preview

**Pattern:** Custom input component with dynamic URL prefix generation

A custom Sanity input component that shows a live URL preview with an asynchronously generated prefix. The prefix updates automatically based on document fields (like language, category, etc.).

**Use case:** Internationalized content, dynamic URL structures, SEO-friendly URLs

**Features:**
- Live URL preview with prefix (e.g., `en-US/articles/my-slug`)
- Async prefix generation based on document fields
- Loading states during prefix resolution
- Auto-slug generation from title
- Full URL tracking for frontend routing

**Files:**
- `schemas/article.ts` - Example document using the feature
- `schemas/objects/urlSlug.ts` - Custom urlSlug object type
- `lib/components/AsyncUrlSlugInput/` - React component and hook
- `lib/helpers/slugGeneration.ts` - Core logic for prefix resolution
- `lib/constants/urlPrefixes.ts` - URL prefix configuration

See [ASYNC_URL_SLUG.md](./ASYNC_URL_SLUG.md) for detailed documentation.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Configuration

1. Create a Sanity project at [sanity.io/manage](https://sanity.io/manage)
2. Update `sanity.config.ts` and `sanity.cli.ts` with your project ID
3. Run the development server:

```bash
pnpm dev
```

### Generate Types

```bash
pnpm typegen
```

## Tech Stack

- Sanity V5
- TypeScript
- pnpm
- React (for custom components)

## Coming Soon: Recursive Taxonomy Examples

This project will include three different approaches to building recursive/hierarchical document structures in Sanity Studio V5:

| Pattern | Description | Use Case | Complexity |
|---------|-------------|----------|------------|
| **Cars** | Self-referencing documents with `parent` field | Hierarchical categories, nested pages | High |
| **Bikes** | Settings-based navigation with nested arrays | Menu-driven navigation, editor-defined structure | High |
| **Clothing** | Simple category filter using `.child()` | Product catalogs, category → items | Low |

These examples will demonstrate different approaches to recursive structures using the Structure Builder API and RxJS observables.

## License

MIT
