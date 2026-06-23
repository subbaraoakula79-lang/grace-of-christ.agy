# Project: Grace of Christ Church Web App Upgrade

## Architecture
The application is a full-stack Next.js and Express app.
- **Frontend**: Next.js 16, TypeScript, Tailwind CSS v4. Consumes Express API from `http://localhost:5000/api`. Handles routing, UI theme rendering, admin login, donation steps, modal presentation, and responsive design.
- **Backend**: Express, Node.js, SQLite via Prisma ORM. Handles user authentication (including 2FA/TOTP), event creation/retrieval, gallery uploads (to Cloudinary or local uploads folder), sermon uploads, and donation storage.
- **Database**: SQLite `dev.db` storing users, events, sermons, donations, gallery images, and audit logs.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| 1 | Exploration & Analysis | Audit layout, styling definitions, page-level classes, admin storage options for QR code, test hooks. | None | PLANNED |
| 2 | E2E Test Suite Creation | Create robust opaque-box test suite for visual theme, admin QR upload, user donate modal, and admin image persistence. | M1 | PLANNED |
| 3 | Visual Theme Alignment | Apply ivory & gold theme across all frontend pages and navigation, remove midnight black styles. | M2 | PLANNED |
| 4 | Donation QR Flow | Implement admin QR upload page, persist URL, and render overlay modal on donate button click. | M2, M3 | PLANNED |
| 5 | Content Persistence | Verify and fix Gallery/Events image CRUD operations on frontend and backend, ensure database persistence. | M2 | PLANNED |
| 6 | Lighthouse Audit Script | Implement `npm run lighthouse` script testing contrast, alt texts, headings, and SEO meta tags. | M2 | PLANNED |
| 7 | Integration Verification | Run E2E tests, execute Forensic Auditor integrity checks, and finalize the codebase. | M3, M4, M5, M6 | PLANNED |

## Interface Contracts
### Admin Settings API
- `POST /api/settings/qr` — Upload/set the donation QR code image. Form-data with file `image` or JSON url.
- `GET /api/settings/qr` — Get current donation QR code config. Returns `{ qrCodeUrl: string }`.

## Code Layout
- `backend/src/server.ts` — Server entry point
- `backend/src/routes/` — Express route registrations
- `backend/src/controllers/` — Express controller logic
- `backend/prisma/schema.prisma` — Database schema definition
- `frontend/app/` — Next.js pages and layouts
- `frontend/components/` — Shared components (Navbar, Footer, Hero)
- `frontend/app/globals.css` — Global CSS stylesheet
