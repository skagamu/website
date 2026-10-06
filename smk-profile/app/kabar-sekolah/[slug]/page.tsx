import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import kabarArticles from "../../../data/kabar-articles.json";
import type { Article } from "../../../types";

const articles = kabarArticles.articles as Article[];

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();

  const paragraphs = (article.body?.trim() || article.excerpt)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-white pb-20">
      <article className="mx-auto max-w-4xl px-6 pt-32 md:pt-40">
        <Link href="/kabar-sekolah" className="text-sm font-semibold text-amber-700 hover:underline">
          ← Kembali ke Kabar Sekolah
        </Link>
        <p className="mt-12 text-sm font-semibold uppercase tracking-widest text-amber-700">{article.categoryLabel}</p>
        <h1 className="mt-4 font-sans text-4xl font-semibold leading-tight text-navy md:text-6xl">{article.title}</h1>
        <p className="mt-5 text-sm text-slate-600">{article.date}{article.meta ? ` · ${article.meta}` : ""}</p>
        <div className="relative mt-10 aspect-video overflow-hidden bg-slate-100">
          <Image src={article.image} alt={article.title} fill sizes="(max-width: 896px) 100vw, 896px" className="object-cover" />
        </div>
        <div className="mt-10 space-y-6 text-lg leading-relaxed text-slate-700">
          {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
      </article>
    </main>
  );
}
