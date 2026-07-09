# ✝ Grace of Christ (GOC) — Church Web Application

A production-ready, premium full-stack web application for Grace of Christ Church, Yetimoga, Kakinada, Andhra Pradesh, India. Led by **Pastor K. John Prasad**.

---

## 🏗 Project Structure

```
project.agy/
├── backend/       Node.js + Express + Prisma + PostgreSQL
└── frontend/      Next.js 16 + TypeScript + Tailwind CSS
```

---

## 🚀 Quick Start (Development)

### 1️⃣ Run the env setup script (generates secrets automatically)
```bash
cd backend
node scripts/setup-env.js
```

### 2️⃣ Set your Database URL
Edit `backend/.env` and update:
```
DATABASE_URL="postgresql://user:password@localhost:5432/goc_db"
```
> 💡 Use [Neon](https://neon.tech) or [Supabase](https://supabase.com) for a free hosted PostgreSQL.

### 3️⃣ Set up the database
```bash
cd backend
npm run db:push      # Push schema to database
npm run db:seed      # Seed admin user + sample data
```

### 4️⃣ Start the backend
```bash
cd backend
npm run dev          # Starts at http://localhost:5000
```

### 5️⃣ Start the frontend
```bash
cd frontend
npm run dev          # Starts at http://localhost:3000
```

---



## 🧪 Mock Mode (Development — No Real Accounts Needed)

The app runs in **mock mode** by default — no Razorpay or email account required:

| Service | Dev Behavior |
|---------|-------------|
| Payment | Mock orders created, always succeed |
| Email   | Logged to console, not actually sent |
| Upload  | Uses placeholder images if Cloudinary not configured |

To switch to production: change `PAYMENT_MODE=razorpay` and `EMAIL_MODE=smtp` in `backend/.env`.

---

## 📄 Pages

| Page | URL |
|------|-----|
| Home | `/` |
| About | `/about` |
| Ministries | `/ministries` |
| Events | `/events` |
| Sermons | `/sermons` |
| Gallery | `/gallery` |
| Contact | `/contact` |
| Donate | `/donate` |
| Receipt | `/donate/receipt/[receiptId]` |
| Admin Login | `/admin/login` |
| Admin Dashboard | `/admin/dashboard` |

---

## 🔗 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ─ | Login (2FA required for admin) |
| POST | `/api/auth/refresh` | Cookie | Refresh access token |
| POST | `/api/auth/totp/setup` | JWT | Setup 2FA |
| POST | `/api/donations/order` | ─ | Create payment order |
| POST | `/api/donations` | ─ | Submit donation |
| GET | `/api/donations/receipt/:id` | ─ | Get receipt details |
| GET | `/api/donations/receipt/:id/pdf` | ─ | Download PDF |
| GET | `/api/donations` | Admin | List all donations |
| GET | `/api/events` | ─ | List events |
| POST | `/api/events` | Admin | Create event |
| GET | `/api/sermons` | ─ | List sermons |
| POST | `/api/contact` | ─ | Submit contact form |
| GET | `/api/reports/summary` | Admin | Dashboard stats |
| GET | `/api/reports/donations/csv` | Admin | Export CSV |
| GET | `/api/mock/status` | ─ | Mock server status (dev only) |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4 |
| Backend | Node.js, Express 4, TypeScript |
| Database | PostgreSQL (Neon/Supabase) |
| ORM | Prisma 5 |
| Auth | JWT (access 15min + refresh 7d) + bcrypt 12 rounds |
| 2FA | TOTP (otplib) — Required for all admins |
| Payment | Razorpay (mock in dev) |
| Email | Nodemailer SMTP (mock in dev) |
| PDF | PDFKit — GOC-YYYY-XXXX receipts |
| Images | Cloudinary CDN (mock in dev) |
| Security | Helmet, CORS, Rate limiting, Zod validation |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#070B14` Midnight Black |
| Primary | `#0E1E3D` Royal Navy |
| Gold | `#D4AF37` Champagne Gold |
| Rose Gold | `#C9848A` |
| Purple | `#7B5EA7` Royal Purple |
| Cream | `#F0EDE8` |
| Display Font | Cormorant Garamond |
| Body Font | Inter |

---

## 🚢 Deployment

| Service | Platform |
|---------|---------|
| Frontend | [Vercel](https://vercel.com) — `cd frontend && vercel` |
| Backend | [Render](https://render.com) or [Railway](https://railway.app) |
| Database | [Neon](https://neon.tech) or [Supabase](https://supabase.com) |
| Images | [Cloudinary](https://cloudinary.com) (free tier) |

---

## 📋 Receipt Format

Every successful donation generates a receipt with ID format:
```
GOC-2026-0001
GOC-2026-0002
...
```

The PDF receipt includes:
- Church name, location, pastor name
- Donor name, email, phone
- Amount in ₹ INR
- Payment method & date
- Unique receipt ID
- Church branding (navy + gold)

---

## 🔒 Security Features

- ✅ JWT authentication (access 15min + refresh 7d httpOnly cookie)
- ✅ 2FA TOTP (required for all admin users)
- ✅ bcrypt password hashing (12 rounds)
- ✅ Rate limiting (auth: 5/15min, global: 200/15min)
- ✅ Zod input validation on all endpoints
- ✅ Helmet security headers (CSP, HSTS, X-Frame-Options)
- ✅ CORS whitelist
- ✅ Audit logging for admin actions
- ✅ Zero storage of payment card data

---

*Built for Grace of Christ Church (GOC), Yetimoga, Kakinada, Andhra Pradesh.*
*Pastor: K. John Prasad*
