"use client";

import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import GlobalNavbar from "../components/GlobalNavbar";
import GlobalFooter from "../components/GlobalFooter";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <html lang="id">
      <head>
        <title>SMK Gajah Mungkur 1 Wuryantoro</title>
        <meta name="description" content="Sekolah vokasi modern yang menyiapkan generasi siap kerja dan siap berkarya." />
      </head>
      <body className={`${jakarta.variable} ${inter.variable}`}>
        {!isAdmin && <GlobalNavbar />}
        {children}
        {!isAdmin && <GlobalFooter />}
      </body>
    </html>
  );
}
