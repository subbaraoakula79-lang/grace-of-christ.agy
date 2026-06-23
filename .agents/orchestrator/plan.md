# Execution Plan

This plan details the steps required to complete the Church Web Application updates.

## Step 1: Explore & Analyze
- Spawn an Explorer subagent to investigate the existing codebase.
- Identify the exact files containing midnight-black/navy styles, hardcoded colors, and gradients.
- Analyze the admin panel routes and schema structure for storing the site config / QR code image URL.
- Identify how content management (Gallery & Events) is currently stored, uploaded, and served, and identify any gaps in persistence.
- Identify accessibility contrast issues, missing meta tags, and check the mobile layout responsiveness structure.
- Recommend exact code changes for visual theme alignment, QR code config storage, overlay modal trigger, admin panels, and Lighthouse audit setup.

## Step 2: E2E Test Suite Design (Dual Track)
- Spawn an E2E Testing Orchestrator subagent to design the opaque-box test suite in a parallel track.
- The test suite must cover all four tiers (Feature coverage, Boundary & Corner, Cross-feature combinations, Real-world workloads) for:
  - Ivory background & gold theme checking.
  - Donation flow with modal displaying admin-uploaded QR code.
  - Content management persistence (adding, editing, deleting Gallery/Events images).
  - Accessibility & SEO automated checks (Lighthouse integration).
- Implement the test cases and the test runner command.
- Generate `TEST_READY.md` containing the test command, runner details, and feature coverage table.

## Step 3: Implement Visual Theme & QR Code Management
- Spawn Worker subagent(s) to implement visual design updates:
  - Override body background with `#FAF9F5` (Ivory), text with `#2E2E2E` (Dark), and accents with `#C3A05F` (Muted Gold).
  - Clean up all over-gradients and dark styles.
  - Ensure the responsive navigation uses top bar on desktop and hamburger side-drawer on mobile.
- Implement QR code settings in backend and frontend:
  - Provide a settings/configuration endpoint or use a local JSON file or new DB table for site config (e.g. `SiteConfig`) to persist the uploaded QR code.
  - Let admins upload/remove QR codes in the admin interface.
  - Show the QR code in a modal overlay when visitors click the Donate button.

## Step 4: Implement Content Management & Persistence
- Spawn Worker subagent(s) to fix or complete the Gallery and Events image additions/edits/deletions.
- Verify persistence using the SQLite database.

## Step 5: Implement Lighthouse Audit Script
- Create an automated audit script (`npm run lighthouse`) that uses a library or custom checks to run accessibility (contrast, headings) and SEO tests (meta tags) and outputs a pass/fail.

## Step 6: Verify and Hardening
- Run the E2E test suite against the updated codebase.
- Perform a Forensic Audit to verify code layout, lack of hardcoded cheats, and true implementation.
- Generate final reports.
