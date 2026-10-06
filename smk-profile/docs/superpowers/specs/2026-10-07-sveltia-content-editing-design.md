# Sveltia Content Editing Design

## Goal

Let school staff update the content they are likely to change without editing source code, and make each CMS field understandable in Indonesian.

## Design

- Keep the existing static JSON and GitHub Pages publishing flow.
- Make `programs.json` the only source for both program cards and program detail pages. Store summaries, detail paragraphs, competencies, careers, partners, and facility cards on each program.
- Move school identity, contact details, navigation links, social links, and PPDB URL into one site-settings file. Move the About-page history timeline into its own file.
- Store growing article, program, alumni, event, faculty, and gallery lists as Sveltia single-file entry collections so each record is edited separately. Keep short page sections as file collections.
- Group Sveltia collections with Indonesian labels, descriptions, icons, and dividers. Replace raw Tailwind layout values with constrained choices or code-owned layout rules.
- Keep page structure, decorative labels, and design styling in code; expose school facts and editorial copy in CMS.

## Data Flow

Sveltia edits JSON in the repository. Next.js imports that data during static generation. A CMS commit triggers the existing Pages build and publishes the updated site.

## Scope

This covers homepage content, program detail content, About-page history, navigation, school identity/contact, PPDB URL, social URLs, and CMS organization. It does not create a custom admin UI or change the hosting architecture.

## Acceptance

- Program edits feed both homepage and matching detail page.
- Editors can update school contact/profile settings and About timeline through Sveltia.
- Growing lists show individual entries; editor-facing labels and instructions are Indonesian.
- No editor needs to type Tailwind classes or manually invent record IDs.
- Static production build succeeds and all program detail routes are generated.
