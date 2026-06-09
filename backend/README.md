# ShopVault — Backend API

REST API built with **Express.js**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

## Tech Stack

| Layer       | Technology                       |
|-------------|----------------------------------|
| Runtime     | Node.js + TypeScript             |
| Framework   | Express.js v4                    |
| ORM         | Prisma v6                        |
| Database    | PostgreSQL (Neon free tier)      |
| Validation  | Zod                              |

## Project Structure

```
src/
├── config/       # Prisma client singleton
├── controllers/  # Route handlers
├── middleware/   # Error handler, request validation
├── routes/       # Express routers
├── services/     # Business logic (DB queries)
├── types/        # Shared TypeScript types / DTOs
└── utils/        # Response helpers
prisma/
├── schema.prisma # Data model
├── seed.ts       # Sample data seeder
└── migrations/   # SQL migration history
```

## Prerequisites

- Node.js 18+
- PostgreSQL (local) **or** a free [Neon](https://neon.tech) database

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Local PostgreSQL:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/product_db?schema=public"

# Or Neon cloud (free):
DATABASE_URL="postgresql://<user>:<password>@<host>/neondb?sslmode=require"

PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Run migrations

```bash
npm run db:migrate
```

### 4. (Optional) Seed sample data

```bash
npm run db:seed
```

### 5. Start dev server

```bash
npm run dev
```

Server runs at `http://localhost:5000`

## API Reference

### Products

| Method | Endpoint                  | Description            |
|--------|---------------------------|------------------------|
| GET    | `/api/products`           | List products (paginated, filterable) |
| POST   | `/api/products`           | Create a product       |
| GET    | `/api/products/:id`       | Get single product     |
| PUT    | `/api/products/:id`       | Update product         |
| DELETE | `/api/products/:id`       | Delete product         |
| GET    | `/api/products/categories`| List all categories    |
| GET    | `/health`                 | Health check           |

### Query Parameters (GET /api/products)

| Param      | Type   | Description                          |
|------------|--------|--------------------------------------|
| `search`   | string | Search by name or description        |
| `category` | string | Filter by category                   |
| `minPrice` | number | Minimum price filter                 |
| `maxPrice` | number | Maximum price filter                 |
| `page`     | number | Page number (default: 1)             |
| `limit`    | number | Items per page (default: 12)         |
| `sortBy`   | string | `price`, `name`, `createdAt`         |
| `sortOrder`| string | `asc` or `desc`                      |

### Create Product (POST /api/products)

```json
{
  "name": "Wireless Headphones",
  "description": "Premium noise-cancelling headphones",
  "price": 299.99,
  "category": "Electronics",
  "stock": 50,
  "imageUrl": "https://images.unsplash.com/photo-..."
}
```

## Scripts

```bash
npm run dev          # Start with hot reload
npm run build        # Compile TypeScript
npm run start        # Run compiled JS
npm run db:migrate   # Apply Prisma migrations
npm run db:seed      # Seed sample products
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset DB (destructive!)
```
