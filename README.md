# FoodDash - Food Ordering Web Application

Full-stack food ordering prototype with bilingual (EN/AR) support, admin dashboard, and local image uploads.

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

- Bilingual menu with category tabs and search
- Cart with slide-out drawer and quantity controls
- Cash on Delivery / simulated Online Payment
- Real-time order status tracking with visual stepper
- Role-based auth (Customer / Admin)
- Admin dashboard with paginated Products CRUD and Orders management
- Local image upload for products
- RTL support for Arabic

## Seed Data

12 menu items in 4 categories (Burgers, Pizza, Drinks, Desserts) with real Unsplash images.
