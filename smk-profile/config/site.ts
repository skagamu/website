// ============================================================================
// KONFIGURASI GLOBAL PPDB
// ============================================================================
// URL Formulir PPDB dikelola terpusat di satu tempat agar mudah diperbarui.
// Di masa depan (FR-10), nilai ini bisa dipindahkan ke environment variable:
//   PPDB_FORM_URL=https://...  (di file .env.local)
// lalu dibaca dengan: process.env.NEXT_PUBLIC_PPDB_FORM_URL ?? FALLBACK
// ============================================================================

import settings from "../data/site-settings.json";

export const PPDB_FORM_URL = process.env.NEXT_PUBLIC_PPDB_FORM_URL ?? settings.ppdbUrl;
