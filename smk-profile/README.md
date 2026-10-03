# FR-01 · Hero Hub SMK Gajah Mungkur 1 Wuryantoro

Implementasi terbatas pada Hero dengan Next.js App Router, TypeScript strict, Tailwind CSS, dan Framer Motion. Aplikasi berada di folder `smk-profile`.

## Menjalankan

```sh
npm install
npm run dev
```

```sh
npm run typecheck
npm run build
npx playwright test
```

Build menghasilkan situs statis di `out`. Sajikan folder tersebut melalui HTTP untuk preview produksi. `next start` tidak mendukung konfigurasi static export.

## Integrasi

```tsx
import HeroHub from "../components/HeroHub";

export default function HomePage() {
  return (
    <main>
      <HeroHub ppdbHref="/ppdb/" facilitiesHref="/fasilitas/360/" />
    </main>
  );
}
```

`ppdbHref` dan `facilitiesHref` adalah titik integrasi ke FR-08 dan FR-04. Halaman/formulir PPDB dan viewer 360° belum termasuk fase FR-01; kedua URL default tersebut belum memiliki halaman tujuan dalam aplikasi Hero-only ini. Isi props dengan URL layanan yang sudah aktif saat mengintegrasikan Hero. Tidak ada formulir atau pengiriman data dalam komponen ini.

## Referensi dan token

- PRD dan spesifikasi dibaca paralel menggunakan `execute` + `Promise.all`.
- Referensi Hero ditemukan di `../jis-clone/src/App.tsx`, baris 273–448. Folder `jis-clone/src/components` tidak ada pada snapshot proyek.
- JIS: media full-bleed, crossfade, garis pemisah dan konten bawah, kontrol melingkar.
- Deep Navy `#0C2340`, Electric Amber `#F59E0B`, Off-White `#F8FAFC`.
- Plus Jakarta Sans display 32–56 px / 1.1; Inter body 16 px / 1.6; fonts disajikan lokal oleh `next/font`.
- CTA pill, target sentuh panah/pause 48×48 px, CTA minimum 56 px.
- Tidak memasang navigasi global atau modul FR lain.

## Media

Media yang disertakan adalah **ilustrasi stok**, bukan dokumentasi SMK Gajah Mungkur 1. Penanda ini juga ditampilkan pada Hero. Dokumentasi sekolah belum tersedia di workspace. Ganti data `heroSlides` dan aset lokal dengan dokumentasi resmi setelah tersedia.

| File lokal | Sumber |
| --- | --- |
| `public/media/hero/workshop.mp4` | [Pexels: Mechanic working on an engine in a smokey garage](https://www.pexels.com/video/mechanic-working-on-an-engine-in-a-smokey-garage-8986894/) |
| `public/media/hero/workshop-poster.jpg` | Frame pertama video yang sama, diekstrak dengan FFmpeg |
| `public/media/hero/collaboration.jpg` | [Unsplash image source](https://images.unsplash.com/photo-1531482615713-2afd69097998) |
| `public/media/hero/workshop.jpg` | [Unsplash image source](https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122) |

Video 720p lokal berdurasi 10,67 detik diputar loop selama slide pertama 15 detik. Foto lokal berukuran lebar 1920 px; masing-masing slide foto 8 detik. Media tidak memerlukan koneksi ke CDN saat runtime. Poster selalu tersedia jika video gagal atau autoplay ditolak.

## Perilaku carousel

- Timeline `MotionValue` dengan `scaleX`, tanpa render React tiap frame.
- Pause menghentikan video dan mempertahankan progress. Resume meneruskan sisa durasi.
- Panah/reset slide mengembalikan progress ke nol; navigasi melingkar.
- Fokus keyboard yang masuk menghentikan autoplay sampai tombol Putar dipilih secara eksplisit.
- ArrowLeft/ArrowRight bekerja ketika fokus berada di Hero.
- Tab tersembunyi atau Hero keluar viewport menghentikan video dan timer sementara.
- Reduced motion: poster statis, tanpa autoplay, crossfade, atau entrance; navigasi manual tetap tersedia.
- Hanya satu H1; latar dekoratif disembunyikan dari screen reader. Perubahan manual diumumkan lewat live region.
- CTA berada di luar konten slide yang diganti agar fokus pengguna tidak hilang ketika slide berubah.

Static export memakai `images.unoptimized` karena tidak ada server optimizer pada GitHub Pages. Foto sudah di-resize ke 1920 px. Untuk deployment pada project subpath GitHub Pages, sesuaikan `basePath` Next.js dan prefiks `videoSrc`/URL CTA dengan lokasi deployment.

## Hasil verifikasi

- `npm run typecheck`: lulus.
- `npm run build`: lulus; Next.js 15.5.27 static export.
- `npx playwright test`: 8 tes lulus pada Google Chrome lokal. Tes membutuhkan Chrome terpasang dan menjalankan server static export secara otomatis jika port 4173 belum dipakai.
- Ukuran layout diuji: 320, 375, 768, 1280, 1440 px. Tidak ada overflow horizontal; CTA terlihat dalam viewport pengujian; semua tombol minimal 48×48 px.
- Lighthouse browser: Accessibility 100, Best Practices 100, SEO 100. Audit ini tidak mengukur performance/Core Web Vitals.
- `npm install`: 0 vulnerabilities setelah override PostCSS ke rentang patch terpasang.
