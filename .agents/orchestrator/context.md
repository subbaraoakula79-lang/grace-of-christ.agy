# Context Recovery Notes

## Background
The user wants to update the Grace of Christ Church website to feature an ivory + muted-gold aesthetic, an admin-uploaded QR code donation flow, persisted content management for Gallery and Events, proper responsiveness (desktop top bar, mobile hamburger menu), accessibility and SEO compliance, and an automated Lighthouse audit script.

## Initial Codebase Findings
- Backend uses Node.js, Express, TypeScript, and SQLite (via Prisma).
- Frontend uses Next.js 16, TypeScript, and Tailwind CSS v4.
- CSS has variables for Ivory and Muted Gold, but they are not fully applied to page sections, which currently refer to var(--midnight) and dark styles.
- Standard payment route exists but needs to support QR code modals.
- Gallery and Events APIs exist but need to be verified for admin persistence.
- Lighthouse script `npm run lighthouse` does not yet exist.

## Next Steps
- Spawn the read-only Explorer subagent to perform an in-depth codebase audit.
