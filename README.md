# Recursive Taxonomy Examples - Sanity V5 Studio

This project demonstrates three different approaches to building recursive/hierarchical document structures in Sanity Studio V5 using the Structure Builder API.

## Examples

### Example 1: Cars - Recursive Parent-Child Structure

**Pattern:** Self-referencing documents with a `parent` field

Documents reference other documents of the same type, creating a tree structure. Uses RxJS observables for reactive updates.

**Use case:** Hierarchical categories, nested pages, organizational structures

**Files:**
- `structure/cars/index.ts` - Main structure
- `structure/cars/queries.ts` - Observable queries for parents/children
- `structure/cars/createChildDraftMenuItem.ts` - Menu action to create child documents

### Example 2: Bikes - Settings-Based Navigation

**Pattern:** Singleton settings document with nested navigation arrays

Navigation structure is defined in a single settings document with nested arrays. Each menu item can reference a target document and have sub-navigation.

**Use case:** Menu-driven navigation, site structure defined by editors

**Files:**
- `structure/bikes/index.ts` - Main structure + MenuItem interface
- `structure/bikes/queries.ts` - Observable queries for navigation
- `structure/bikes/childList.ts` - Recursive child list builder
- `structure/bikes/detailDocListItem.ts` - Single document list item

### Example 3: Clothing - Simple Category Filter

**Pattern:** Built-in `documentTypeList` with `.child()` and `.filter()`

The simplest approach - show categories, then filter items by selected category.

**Use case:** Simple category → items relationships, product catalogs

**Files:**
- `structure/clothing/index.ts` - Complete structure in one file

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
- RxJS (for reactive queries)

## Structure Comparison

| Feature | Cars | Bikes | Clothing |
|---------|------|-------|----------|
| Complexity | High | High | Low |
| RxJS Required | Yes | Yes | No |
| Nesting Depth | Unlimited | Unlimited | 1 level |
| Data Model | Self-referencing | Settings array | Category reference |
| Real-time Updates | Yes | Yes | Yes |
| Create Children in Structure | Yes | No | No |

## License

MIT
