# FoodDash - Food Ordering Web Application

Full-stack food ordering prototype with bilingual (EN/AR) support, admin dashboard with category management, and local image uploads.

## Quick Start

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin Access

- **Email:** admin@fooddash.com
- **Password:** Admin@123

## Tech Stack

Next.js 16 · TypeScript · Tailwind CSS v4 · SQLite · Prisma · JWT · bcrypt

## Features

- **Bilingual EN/AR** — Full Arabic translation across all pages, API errors, and admin panel
- **RTL Support** — Proper right-to-left layout with LRM-protected number display
- **Category browsing** — Dynamic categories loaded from database, filter by category
- **Search** — Real-time product search by name (EN/AR)
- **Cart** — Slide-out drawer with quantity controls, subtotal, and free delivery
- **Checkout** — Delivery address form with Cash on Delivery / simulated Online Payment
- **Order tracking** — Visual stepper with auto-refresh every 5 seconds
- **Order history** — Paginated list of past orders for authenticated users
- **Auth** — JWT-based registration/login with role-based access (Customer / Admin)
- **Admin Dashboard** — Overview stats (orders, revenue, products)
- **Products CRUD** — Paginated table with bilingual form and local image upload
- **Orders Management** — Paginated table with inline status updates
- **Categories CRUD** — Paginated table with bilingual form, managed from admin panel
- **Local Image Upload** — UUID-named files stored in `public/uploads/`

## Seed Data

12 menu items across 4 categories (Burgers, Pizza, Drinks, Desserts) with real Unsplash images.

## Project Structure

```
src/
├── app/            # App Router pages and API routes
│   ├── admin/      # Admin dashboard, products, orders, categories
│   ├── api/        # REST API routes (auth, products, orders, categories, upload)
│   ├── checkout/   # Checkout page
│   ├── login/      # Login page
│   ├── orders/     # Order history and tracking
│   └── register/   # Registration page
├── components/     # Shared UI components
├── contexts/       # Auth, Cart, Language providers
└── lib/            # Auth helpers, Prisma client, constants, types
```

## Environment

No `.env` file required — JWT secret defaults to a dev key. Set `JWT_SECRET` in production.
