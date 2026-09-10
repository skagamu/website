# SKAGAMU Digital Branding & CMS - AI Agent Guidelines

## 1. Project Overview
- **Project**: SKAGAMU Digital Branding & Student Showcase Portal + CMS Admin Panel (3-Layer Educational Hierarchy: Bab -> Project -> Karya).
- **Root Path**: `/Users/burhanyudha/Library/CloudStorage/GoogleDrive-burhanyudhaprawira@gmail.com/My Drive/SMK GAJAH MUNGKUR 1 WURYANTORO/SKAGAMU Digital Branding`
- **Git Repo**: `https://github.com/skagamu/website.git` (branch `main`).
- **Live URL**:
  - Landing Page: `https://skagamu.github.io/website/`
  - Admin CMS: `https://skagamu.github.io/website/admin.html`
  - Local Dev Server: `http://localhost:8080/`

## 2. Architecture & Backend (GAS DB)
- **GAS Endpoint**: `https://script.google.com/macros/s/AKfycbzJoZ5OjeiUVHNZ6eCl6FSdwpJJre5cLgUQ5Pawr-5_5gSbDJza3c11vL_BjXSVBG7N/exec`
- **GAS Script ID**: `1_lF1z09YUaDnNyhbiaRSLNclUW7NY-n8PLm3BuZGwbsVjp959zmTf0dV`
- **Clasp Binary**: `~/.clasp_dir/node_modules/.bin/clasp` (Local gas folder configured in `gas/`)
- **Database (Google Sheets)**:
  - `users`: Dynamic credentials check (`username`, `password`, `name`, `role`, `created_at`).
  - `babs`: Learning modules / Chapters (`id`, `title`, `description`, `order`, `created_at`).
  - `projects`: Assignment projects (`id`, `bab_id`, `title`, `brief`, `lkpd_url`, `deadline`, `order`, `created_at`).
  - `karya`: Student submissions (`id`, `project_id`, `title`, `student_name`, `class`, `media_type`, `media_url`, `description`, `status`, `created_at`).
  - `gallery`: Activity photo masonry (`id`, `title`, `image_url`, `order`, `created_at`).
  - `settings`: Site metadata (`hero_title`, `contact_email`, etc.).
- **Image/File Storage**: Google Drive folder `SKAGAMU_UPLOADS` (public direct view proxy `https://lh3.googleusercontent.com/d/{fileId}`).

## 3. Tech Stack & Design System
- **Pure Web Stack**: Vanilla HTML5, Modern CSS3 (Custom Properties), Vanilla JS (ES6+), Lucide Icons, Plus Jakarta Sans.
- **Design Archetype**: 
  - Public: VoltAgent Framer Dark Canvas (`#090909`, hairline border `#262626`, radiant glow `#ff7a3d` / `#6a4cf5`).
  - Admin: Windows Explorer / Linear folder drill-down hierarchy (`#0f1011`).
- **Animation System**: Pure CSS + `IntersectionObserver` in `assets/css/style.css` & `assets/js/app.js` (duration 1600ms, timing `cubic-bezier(0.16, 1, 0.3, 1)`, cursor radial spotlight tracking, mask text reveal on hero).
- **Showcase Limit**: Landing page renders the top 6 latest student works with module/project contextual badge & rich modal lightbox.

## 4. Key Files
- `index.html`: Public landing page (Hero, 6 Latest Student Works Grid, Masonry Gallery, About, Contact).
- `admin.html`: CMS Dashboard (Windows Explorer folder navigator: Modul -> Projects -> Karya, LKPD & Multi-media manager).
- `assets/js/config.js`: Global `CONFIG` object & `fetchAPI` helper.
- `assets/js/app.js`: Public data fetching, 6 latest items filtering, scroll animations, spotlight, modal lightbox.
- `assets/js/admin.js`: Dynamic auth validation against `users` sheet, folder drill-down state, LKPD & media upload.
- `assets/css/style.css`: All styles, folder UI tokens, responsive tokens, browser mockup container.
- `PRD.md`: Full requirements & architectural specifications.

## 5. Deployment & Development Rules
- **Auto-Sync Mandate**: Setiap agent yang mengubah struktur endpoint, DB sheet, fitur baru, atau UI tokens WAJIB memperbarui `AGENTS.md` dan `PRD.md` sebelum commit.
- **CI/CD**: Auto-deploy to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`.
- **Local Testing**: Run local server via `npx serve -l 8080` or `python3 -m http.server 8080`.
- **GAS Updates**: Use `~/.clasp_dir/node_modules/.bin/clasp push` + `redeploy` inside `gas/` directory.
- **Git Protocol**: Commit atomic changes with descriptive commit messages and push to `origin main`.
