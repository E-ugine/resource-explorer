# Resource Explorer (Rick and Morty)

A polished React + Vite + Tailwind + shadcn UI single-page app to explore Rick and Morty characters with search, filters, sorting, pagination, detail view, and favorites persisted to localStorage.

## Dataset
- Rick and Morty API: https://rickandmortyapi.com/

Live app: (https://resource-explorer-zeta.vercel.app/)

## Features
- List view with server pagination
- Debounced search (URL-synced)
- Filters: status, gender (URL-synced)
- Sorting: name, created (URL-synced)
- Favorites: toggle from list/detail, persisted locally; filter to show favorites
- Detail view at /items/:id with rich info + JSON-LD
- 

# Getting Started Locally

✅ Prerequisites
Node.js + npm installed
Git installed and configured

Clone and Run the Project
# 1. Clone the repository
git clone <HTTPS URL>

# 2. Move into the project directory
cd resource-explorer

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev

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
