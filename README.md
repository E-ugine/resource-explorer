# Resource Explorer (Rick and Morty)

A polished React + Vite + Tailwind + shadcn UI single-page app to explore Rick and Morty characters with search, filters, sorting, pagination, detail view, and favorites persisted to localStorage.

## Dataset
- Rick and Morty API: https://rickandmortyapi.com/

## Features
- List view with server pagination
- Debounced search (URL-synced)
- Filters: status, gender (URL-synced)
- Sorting: name, created (URL-synced)
- Favorites: toggle from list/detail, persisted locally; filter to show favorites
- Detail view at /items/:id with rich info + JSON-LD
- Error states with retry, skeleton loaders
- Cancel in-flight requests (React Query with fetch AbortController)
- Nice-to-haves implemented:
  - React Query caching + background refetch
  - Code-splitting for detail route
  - Theme toggle with persistent preference

## Getting started
1. npm i
2. npm run dev
3. Visit http://localhost:8080

## URL as source of truth
All state (q, status, gender, sort, fav, page) is encoded in the URL so it’s shareable and reload-safe.

## Trade-offs
- Favorites-only view filters current page results for simplicity. Could be enhanced to fetch by IDs to compose a full favorites-only list.
- Sorting is client-side for responsiveness.

## Tech
- React, Vite, TypeScript
- Tailwind CSS + shadcn
- TanStack Query
- next-themes for theming

## Scripts
- dev: start dev server
- build: production build

## Accessibility & SEO
- Semantic markup, visible focus states
- Single H1 per page
- Meta tags and canonical link
- JSON-LD on detail pages
