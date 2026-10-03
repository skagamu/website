// ============================================================================
// KONFIGURASI GLOBAL PPDB
// ============================================================================
// URL Formulir PPDB dikelola terpusat di satu tempat agar mudah diperbarui.
// Di masa depan (FR-10), nilai ini bisa dipindahkan ke environment variable:
//   PPDB_FORM_URL=https://...  (di file .env.local)
// lalu dibaca dengan: process.env.NEXT_PUBLIC_PPDB_FORM_URL ?? FALLBACK
// ============================================================================

export const PPDB_FORM_URL =
  process.env.NEXT_PUBLIC_PPDB_FORM_URL ??
  "https://docs.google.com/forms/d/e/1FAIpQLSdooWVprIeIY2Vx6zcZzKVbKjaMsciv5sLdKWR9c6Ar47HGYg/viewform?usp=dialog";
