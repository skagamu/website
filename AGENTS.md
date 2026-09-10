# SKAGAMU Digital Branding & CMS - AI Agent Guidelines

## 1. Project Overview
- **Project**: SKAGAMU Digital Branding & Student Showcase Portal + CMS Admin Panel.
- **Root Path**: `/Users/burhanyudha/Library/CloudStorage/GoogleDrive-burhanyudhaprawira@gmail.com/My Drive/SMK GAJAH MUNGKUR 1 WURYANTORO/SKAGAMU Digital Branding`
- **Git Repo**: `https://github.com/skagamu/website.git` (branch `main`).
- **Live URL**:
  - Landing Page: `https://skagamu.github.io/website/`
  - Admin CMS: `https://skagamu.github.io/website/admin.html`
  - Local Dev Server: `http://localhost:8080/`

## 2. Architecture & Backend (GAS DB)
- **GAS Endpoint**: `https://script.google.com/macros/s/AKfycbzJoZ5OjeiUVHNZ6eCl6FSdwpJJre5cLgUQ5Pawr-5_5gSbDJza3c11vL_BjXSVBG7N/exec`
- **GAS Script ID**: `1_lF1z09YUaDnNyhbiaRSLNclUW7NY-n8PLm3BuZGwbsVjp959zmTf0dV`
- **Clasp Binary**: `~/.clasp_dir/node_modules/.bin/clasp`
- **Database (Google Sheets)**:
  - `users`: Dynamic credentials check (`username`, `password`, `role`, `updated_at`).
  - `portfolio`: Student works (`id`, `title`, `category`, `author`, `image_url`, `description`, `status`, `created_at`).
  - `gallery`: Activity photo masonry (`id`, `title`, `image_url`, `order`, `created_at`).
  - `settings`: Site copy & metadata (`hero_title`, `hero_lead`, `about_title`, `about_desc`, `contact_email`, `footer_text`).
- **Image Storage**: Google Drive folder `SKAGAMU_UPLOADS` (public direct view proxy `https://lh3.googleusercontent.com/d/{fileId}`).

## 3. Tech Stack & Design System
- **Pure Web Stack**: Vanilla HTML5, Modern CSS3 (Custom Properties), Vanilla JS (ES6+), Lucide Icons, Plus Jakarta Sans.
- **Design Archetype**: VoltAgent Framer Dark Canvas (`#090909`, hairline border `#262626`, radiant glow `#ff7a3d` / `#6a4cf5`).
- **Animation System**: Pure CSS + `IntersectionObserver` in `assets/css/style.css` & `assets/js/app.js` (duration 1600ms, timing `cubic-bezier(0.16, 1, 0.3, 1)`, cursor radial spotlight tracking, mask text reveal on hero).
- **Gallery**: Pure CSS editorial asymmetric masonry grid (`column-count`).

## 4. Key Files
- `index.html`: Public landing page (Hero, Filterable Portfolio, Masonry Gallery, About, Contact).
- `admin.html`: CMS Dashboard (Dynamic login modal, Portfolio manager with canvas compressor, Gallery uploader, Settings editor).
- `assets/js/config.js`: Global `CONFIG` object & `fetchAPI` helper.
- `assets/js/app.js`: Public data fetching, fallback data, scroll animations, cursor spotlight, modal lightbox.
- `assets/js/admin.js`: Dynamic auth validation against `users` sheet, image compression, CRUD handlers.
- `assets/css/style.css`: All styles, responsive tokens, browser mockup container, keyframe animations.
- `PRD.md`: Full requirements & architectural specifications.

## 5. Deployment & Development Rules
- **Auto-Sync Mandate**: Setiap agent yang mengubah struktur endpoint, DB sheet, fitur baru, atau UI tokens WAJIB memperbarui `AGENTS.md` dan `PRD.md` sebelum commit.
- **CI/CD**: Auto-deploy to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`.
- **Local Testing**: Run local server via `npx serve -l 8080` or `python3 -m http.server 8080`.
- **GAS Updates**: Use clasp push or update Code.gs when modifying backend handlers.
- **Git Protocol**: Commit atomic changes with descriptive commit messages and push to `origin main`.
