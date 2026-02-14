# 🍽️ The BP Street — Food Ordering Web App

A full-stack food ordering platform for **The BP Street**, a North Indian street food restaurant. Customers can browse the menu, add items to cart, place orders, and track deliveries. Admins get a dedicated dashboard to manage products, orders, and store settings.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

---

## ✨ Features

### 🛒 Customer Side
- **Browse Menu** — View food items by category (Momos, Rice & Noodles, Starters, Beverages)
- **Search & Filter** — Find dishes quickly with veg/non-veg filters
- **Cart Management** — Add, remove, and update quantities
- **User Authentication** — Signup/Login with email & OTP verification
- **Order Placement** — Checkout with address selection and payment method
- **Order Tracking** — Track order status in real-time
- **Account Management** — Manage profile, addresses, and order history

### 🔧 Admin Dashboard
- **Order Management** — View and update order statuses
- **Product Management** — Add, edit, and manage menu items
- **Store Settings** — Configure store hours, delivery radius, pricing, and more
- **Analytics** — View key stats like total orders, revenue, and user count

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Backend** | Next.js API Routes (App Router) |
| **Database** | MongoDB Atlas (via Prisma ORM) |
| **Authentication** | NextAuth.js (Credentials + OTP) |
| **Email** | Nodemailer (Gmail SMTP) |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
the-bp-street/
├── prisma/
│   ├── schema.prisma       # Database schema (User, Product, Cart, Order, etc.)
│   └── seed.js             # Seed script to populate sample menu items
├── public/
│   └── images/             # Food & brand images
├── src/
│   ├── app/
│   │   ├── api/            # API routes (auth, cart, orders, products, admin)
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── login/          # Login page
│   │   ├── signup/         # Signup page
│   │   ├── menu/           # Menu browsing page
│   │   ├── checkout/       # Checkout flow
│   │   ├── track/          # Order tracking
│   │   ├── account/        # User account pages
│   │   ├── offers/         # Offers/deals page
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Homepage
│   │   └── globals.css     # Global styles & design tokens
│   ├── components/
│   │   ├── home/           # Hero, CategoryCards, PopularItems, Reviews, etc.
│   │   ├── layout/         # Navbar, Footer, Sidebar, etc.
│   │   ├── cart/           # Cart drawer component
│   │   ├── menu/           # Menu page components
│   │   ├── providers/      # Context providers (e.g., SessionProvider)
│   │   └── ui/             # Reusable UI components
│   ├── context/            # React contexts (e.g., CartContext)
│   ├── data/               # Static data (menu items)
│   └── lib/                # Utilities (Prisma client, auth config, email helper)
├── .env.example            # Environment variable template (safe to commit)
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ — [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas** account — [Sign up free](https://www.mongodb.com/atlas)
- **Git** — [Download here](https://git-scm.com/downloads)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/the-bp-street.git
cd the-bp-street
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority"

# NextAuth
NEXTAUTH_SECRET="your-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Gmail SMTP (for OTP emails)
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-gmail-app-password"
```

> **💡 How to get a Gmail App Password:**
> 1. Go to [Google Account Security](https://myaccount.google.com/security)
> 2. Enable **2-Step Verification**
> 3. Go to **App Passwords** → Generate one for "Mail"

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Seed the Database (Optional)

Populate the database with sample menu items:

```bash
node prisma/seed.js
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📸 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero section, categories, popular items, reviews |
| Menu | `/menu` | Full menu with filters and search |
| Login | `/login` | User login with email/password |
| Signup | `/signup` | New user registration with OTP verification |
| Checkout | `/checkout` | Order summary, address, payment |
| Track Order | `/track` | Real-time order tracking |
| Account | `/account` | Profile, addresses, order history |
| Offers | `/offers` | Current deals and discounts |
| Admin Dashboard | `/admin` | Admin panel for managing the store |

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | Secret key for NextAuth session encryption |
| `NEXTAUTH_URL` | Your app URL (e.g., `http://localhost:3000`) |
| `GMAIL_USER` | Gmail address used for sending OTP emails |
| `GMAIL_APP_PASSWORD` | Gmail App Password for SMTP |

> ⚠️ **Never commit your `.env` file!** It is already listed in `.gitignore`.

---

## 🧑‍💻 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint checks |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma studio` | Open Prisma Studio (DB GUI) |
| `node prisma/seed.js` | Seed database with sample data |

---

## 📝 License

This project is for educational/personal use.

---

## 🙋 Author

Built with ❤️ for **The BP Street**.
