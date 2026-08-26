import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();
  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-white to-stone-50 p-8">
        <h1 className="text-2xl font-semibold tracking-tight">回测手记 · 从单市场到多资产的求证</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          这里记录 <code>mp10 S-3 43.1/35.6/43.3%</code> 之后，每一个形态/多资产假设的证伪与保留。
          全部跑在真实行情上，支持图片、表格与代码块，部署于 Cloudflare 免费栈。
        </p>
        <div className="mt-4 flex gap-2 text-xs">
          <span className="rounded-full border border-[var(--border)] bg-white px-2.5 py-1">Next.js 16</span>
          <span className="rounded-full border border-[var(--border)] bg-white px-2.5 py-1">MDX + GFM 表格</span>
          <span className="rounded-full border border-[var(--border)] bg-white px-2.5 py-1">Cloudflare Pages</span>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold">最新文章 · {posts.length} 篇</h2>
        {posts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">
            还没有文章，去 <code>content/posts/*.md</code> 新建
          </p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {posts.map((p) => (
              <li key={p.slug} className="group rounded-xl border border-[var(--border)] bg-white p-5 transition hover:border-[var(--accent)]/30 hover:shadow-sm">
                <div className="text-xs text-[var(--muted)]">{p.date} · {p.tags.join(" · ")}</div>
                <Link href={`/posts/${p.slug}`} className="mt-1 block text-base font-medium group-hover:text-[var(--accent)]">
                  {p.title}
                </Link>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{p.summary}</p>
                <Link href={`/posts/${p.slug}`} className="mt-3 inline-block text-xs font-medium text-[var(--accent)]">阅读 →</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
