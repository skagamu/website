# Website Profil SMK Gajah Mungkur 1 Wuryantoro

Website resmi profil SMK Gajah Mungkur 1 Wuryantoro. Dibangun menggunakan Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, dan terintegrasi dengan Sveltia CMS sebagai pengelola konten statis via Git.

## Arsitektur & Teknologi

*   **Framework:** Next.js 15 (Static Export `output: 'export'`)
*   **Styling:** Tailwind CSS (Strict Editorial Style: Deep Navy & Amber, Tanpa sudut melengkung/border-radius)
*   **Animasi:** Framer Motion (Hero Carousel, Scroll Reveal)
*   **Content Management System:** Sveltia CMS (Git-based headless CMS)
*   **Hosting Target:** GitHub Pages
*   **CI/CD:** GitHub Actions (Deployment Otomatis)

## Struktur Konten (CMS-Ready)

Semua konten dinamis diatur dalam folder `data/` berbentuk `.json` yang dikelola secara langsung melalui antarmuka CMS. Tidak ada data *hardcode* pada komponen UI.
*   `kabar-sekolah/` - Menyimpan artikel/berita mandiri untuk halaman Kabar Sekolah.
*   `kabar-sekolah.json` - Mengatur struktur layout/paragraf statis untuk halaman Kabar Sekolah.
*   `alumni.json` - Direktori dan testimoni alumni.
*   `events.json` - Data kalender akademik, lomba, dan acara.
*   `faculty.json` - Daftar dewan guru dan staf.
*   `gallery.json` - Album foto aktivitas sekolah.
*   `hero.json`, `programs.json`, dan `manifesto.json` - Slide beranda, program keahlian, serta visi dan misi.
*   `kabar-articles.json` - Hasil gabungan otomatis artikel di `data/kabar-sekolah/`; jangan edit file ini secara langsung.

## Menjalankan Aplikasi Lokal

```sh
# Instalasi dependensi
npm install

# Menjalankan server pengembangan (Hot-reload)
npm run dev
```

Aplikasi dapat diakses pada `http://localhost:3000`.

## Mengelola Konten dengan Sveltia CMS

Sveltia CMS beroperasi secara *Client-Side* tanpa perlu backend server Node.js.

### Akses CMS di Mode Development
Akses CMS melalui browser di alamat:
`http://localhost:3000/admin/index.html` (atau menyesuaikan port saat build statis menggunakan `http://localhost:4173/admin/index.html`).

CMS terhubung langsung dengan repositori GitHub `skagamu/website`. Setiap kali admin menyimpan (Save) perubahan melalui antarmuka ini, Sveltia CMS akan membuat sebuah *Git Commit* langsung ke _branch_ `main` di GitHub Anda.

Unggahan media disimpan ke `smk-profile/public/media/` dan URL yang dipakai situs diawali `/website/media/`. Artikel baru dibuat di koleksi **Kabar Sekolah (Artikel)**. Isi artikel dapat diisi pada kolom **Isi Artikel** dengan satu baris kosong di antara paragraf; kartu berita akan menuju halaman detail artikel setelah build selesai.

## Build Produksi

Website dirancang murni statis agar dapat didistribusikan via GitHub Pages dengan mulus.

```sh
# Script ini secara otomatis menggabungkan folder artikel JSON dan merakit build statis
npm run build

# Jika ingin mengetes hasil build statis di lokal:
npx http-server out -p 4173 -a 0.0.0.0
# atau menggunakan modul python bawaan:
python3 -m http.server 4173 -d out
```

*Perhatian: Perintah `next start` tidak didukung karena Next.js dikonfigurasi sebagai Static Export.*

## Deployment Otomatis (CI/CD)

Proyek ini telah dikonfigurasi dengan GitHub Actions (`.github/workflows/deploy.yml`).
Setiap kali ada perubahan pada branch `main` (baik karena Anda melakukan `git push` secara manual, maupun karena Admin menerbitkan konten baru via Sveltia CMS), GitHub secara otomatis akan mem-build ulang *website* ini dan menayangkannya ke GitHub Pages dalam hitungan menit.

## Ketentuan Desain (UI/UX)
*   **Palet Warna:**
    *   Deep Navy (`#0C2340`) sebagai dominan
    *   Electric Amber (`#F59E0B`) sebagai aksen (CTA, Highlight)
    *   Off-White (`#F8FAFC`) / Slate untuk latar bacaan
*   **Tipografi:**
    *   Plus Jakarta Sans (Heading) - *tight tracking*
    *   Inter (Body)
*   **Bentuk (Shape):**
    *   Wajib siku tajam. Nol piksel *border radius* untuk semua elemen (kartu, tombol, kontainer gambar) untuk kesan industrial-korporat yang tegas.
