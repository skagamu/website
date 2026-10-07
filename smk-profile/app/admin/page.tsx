"use client";

import { useEffect } from "react";

const CMS_PATH = "/website/admin/index.html";

export default function AdminRedirectPage() {
  useEffect(() => {
    window.location.replace(CMS_PATH);
  }, []);

  return (
    <main className="mx-auto max-w-xl px-6 py-16 text-center text-navy">
      <p>Membuka Sveltia CMS…</p>
      <a className="mt-4 inline-block underline" href={CMS_PATH}>
        Buka Sveltia CMS
      </a>
    </main>
  );
}
