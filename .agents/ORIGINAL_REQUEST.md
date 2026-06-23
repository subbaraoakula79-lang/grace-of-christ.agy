# Original User Request

## 2026-06-20T06:58:04Z

# Teamwork Project Prompt — Draft

> Status: Step 3 — Determining integrity mode
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

Create a premium, trustworthy website for Grace of Christ Church that presents a clean, minimal ivory + muted‑gold aesthetic (no over‑gradients), and includes a production‑ready donation flow where admins can upload a QR code (via admin UI) that appears when users click the Donate button.

**Resolved ambiguities**
- Aesthetic: ivory & muted gold palette, subtle shadows.
- Donation QR: admin uploads image through a simple UI (stored in site config).
- Admin features: UI to add/remove gallery and events images, plus QR management.
- Navigation: top bar on desktop, hamburger side‑drawer on mobile.
- Responsive design: mobile‑first, supporting all screen sizes.

Working directory: ~/teamwork_projects/church_site

## Verification Resources

- Lighthouse audit script (`npm run lighthouse`) that outputs pass/fail results for accessibility and SEO criteria.

## Requirements

### R1. Visual design
The site must use an ivory background with muted‑gold accents, minimal gradients, and a premium, trustworthy look appropriate for a church.

### R2. Donation flow
Admins can upload a QR‑code image via the admin panel; when a visitor clicks the Donate button, the QR appears in an overlay.

### R3. Content management
Admins can add, edit, and delete images for the Gallery and Events pages through the same admin interface.

### R4. Accessibility & SEO
All pages must meet WCAG AA contrast standards, include proper heading hierarchy, meta tags, and be fully responsive (mobile‑first).

## Acceptance Criteria

- [ ] UI palette is ivory (#FAF9F5) with muted‑gold (#C3A05F); no bright gradients.
- [ ] Donate button triggers a modal displaying the admin‑uploaded QR code.
- [ ] Admin panel allows uploading/removing images for Gallery and Events; changes persist.
- [ ] Navigation works as described (top bar desktop, hamburger drawer mobile).
- [ ] Site passes automated Lighthouse accessibility (≥ 90) and SEO checks (script returns pass).
- [ ] Responsive layout renders correctly on devices ≥ 320 px width.

---
*Next: when approved → delegate via invoke_subagent (see Delegation Protocol)*

## Follow-up — 2026-06-20T07:12:44Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

Create a premium, trustworthy website for Grace of Christ Church that presents a clean, minimal ivory + muted‑gold aesthetic (no over‑gradients), and includes a production‑ready donation flow where admins can upload a QR code (via admin UI) that appears when users click the Donate button.

**Resolved ambiguities**
- Aesthetic: ivory & muted gold palette, subtle shadows.
- Donation QR: admin uploads image through a simple UI (stored in site config).
- Admin features: UI to add/remove gallery and events images, plus QR management.
- Navigation: top bar on desktop, hamburger side‑drawer on mobile.
- Responsive design: mobile‑first, supporting all screen sizes.

Working directory: TBD

## Requirements

### R1. Visual design
The site must use an ivory background with muted‑gold accents, minimal gradients, and a premium, trustworthy look appropriate for a church.

### R2. Donation flow
Admins can upload a QR‑code image via the admin panel; when a visitor clicks the Donate button, the QR appears in an overlay.

### R3. Content management
Admins can add, edit, and delete images for the Gallery and Events pages through the same admin interface.

### R4. Accessibility & SEO
All pages must meet WCAG AA contrast standards, include proper heading hierarchy, meta tags, and be fully responsive (mobile‑first).

## Acceptance Criteria

- [ ] UI palette is ivory (#FAF9F5) with muted‑gold (#C3A05F); no bright gradients.
- [ ] Donate button triggers a modal displaying the admin‑uploaded QR code.
- [ ] Admin panel allows uploading/removing images for Gallery and Events; changes persist.

- [ ] Navigation works as described (top bar desktop, hamburger drawer mobile).
- [ ] Site passes automated Lighthouse accessibility (≥ 90) and SEO checks.
- [ ] Responsive layout renders correctly on devices ≥ 320 px width.

---
*Next: when approved → delegate via invoke_subagent (see Delegation Protocol)*

Working directory: ~/teamwork_projects/church_site

## Verification Resources

- Lighthouse audit script (`npm run lighthouse`) that outputs pass/fail results for accessibility and SEO criteria.

---
*Next: when approved → delegate via invoke_subagent (see Delegation Protocol)*

## Follow-up — 2026-06-23T09:33:27Z

Please continue the implementation of the premium UI redesign and donation flow as approved in the plan. Ensure all components, theme, admin QR handling, and accessibility/SEO are completed.
## Follow-up — 2026-06-23T09:32:20Z

Please continue the implementation of the premium UI redesign and donation flow as approved in the plan. Ensure all components, theme, admin QR handling, and accessibility/SEO are completed.


