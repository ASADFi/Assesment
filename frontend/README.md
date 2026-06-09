# ShopVault — Frontend

Product catalog web app built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **Zustand**.

## Tech Stack

| Layer          | Technology                    |
|----------------|-------------------------------|
| Framework      | Next.js 16 (App Router)       |
| Language       | TypeScript                    |
| Styling        | Tailwind CSS v4               |
| State          | Zustand (with devtools)       |
| HTTP Client    | Axios                         |
| Notifications  | react-hot-toast               |
| Icons          | Lucide React                  |

## Features

- Landing page with product grid
- Add product via modal form with client-side validation
- Search, filter by category, and sort products
- Pagination with meta from API
- Delete products with confirmation
- Loading skeletons while fetching
- Fully responsive layout

## Project Structure

```
src/
├── app/               # Next.js App Router (layout, page)
├── components/
│   ├── layout/        # Navbar, Footer
│   ├── products/      # ProductCard, ProductGrid, Filters, Pagination, Modal
│   └── ui/            # Button, Input, Textarea, Badge, Modal
├── lib/
│   ├── api.ts         # Axios API client
│   └── utils.ts       # cn(), formatPrice(), formatDate()
├── store/
│   └── productStore.ts # Zustand store
└── types/
    └── index.ts        # Shared TypeScript types
```

## Prerequisites

- Node.js 18+
- Backend API running (see `../backend/README.md`)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

`.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start dev server

```bash
npm run dev
```

App runs at `http://localhost:3000`

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Running Both Together

Start the backend first, then the frontend:

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```
