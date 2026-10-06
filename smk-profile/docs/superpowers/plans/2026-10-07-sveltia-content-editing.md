# Sveltia Content Editing Implementation Plan

> **For agentic workers:** Execute inline in this session; keep the user's existing untracked files untouched.

**Goal:** Make the agreed school content editable through Sveltia while preserving the static GitHub Pages flow.

**Architecture:** JSON remains the source of truth. Shared components import the same data files that Sveltia edits; Sveltia collections present individual records and safe, labeled fields.

**Tech Stack:** Next.js 15 App Router, TypeScript, JSON, Sveltia CMS YAML configuration.

**Spec:** `docs/superpowers/specs/2026-10-07-sveltia-content-editing-design.md`

## Global Constraints

- Preserve `output: "export"` and the `/website` base path.
- Do not add dependencies or a custom admin application.
- Do not stage or alter `Documentations/`, `app/admin-custom/`, or `../aggregate_articles.js`.
- Keep decorative layout classes in code; CMS values must use readable text or constrained options.

---

### Task 1: Normalize editable collection models

**Files:** `data/programs.json`, `data/alumni.json`, `data/events.json`, `data/faculty.json`, `data/gallery.json`, `data/school-profile.json`, `data/site-settings.json`, `types/index.ts`, `public/admin/config.yml`.

- [ ] Convert growing lists to single-file arrays and give each collection Indonesian labels, icons, descriptions, and safe fields.
- [ ] Add shared program detail content, school timeline, and site settings using the content currently displayed by the site.
- [ ] Replace raw gallery spans and event Tailwind classes with constrained layout/theme values.

### Task 2: Connect pages to the shared editable data

**Files:** `app/program/[slug]/page.tsx`, `app/tentang-kami/page.tsx`, `components/GlobalNavbar.tsx`, `components/GlobalFooter.tsx`, `components/ProgramKeahlianBento.tsx`, `components/TabbedCarousel.tsx`, `components/AlumniCarousel.tsx`, `components/EventCarousel.tsx`, `components/TeacherProfile.tsx`, `components/SchoolGallery.tsx`, `app/alumni/page.tsx`, `app/berita/page.tsx`, `config/site.ts`.

- [ ] Replace duplicate program detail constants with lookup from `programs.json`.
- [ ] Replace school/contact/menu/social and About history literals with the CMS files.
- [ ] Update list consumers for the normalized JSON arrays and map constrained display values to static CSS classes.

### Task 3: Verify editor schema and production output

**Files:** CMS config and affected data consumers.

- [ ] Parse `public/admin/config.yml` and check all referenced data paths and field names.
- [ ] Run `npm run build` from a local checkout copy; confirm static generation includes each program and article route.
- [ ] Inspect the final diff and confirm unrelated untracked files remain untouched.
