import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { getAllBooks } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();
  const books = getAllBooks();
  return (
    <div className="flex flex-col gap-10">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-white via-stone-50 to-white p-8 md:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-orange-100 to-stone-100 blur-3xl" />
        <div className="relative">
          <Badge variant="secondary" className="gap-1.5">
            <Icon name="lucide:sparkles" size={12} /> 通用博客 · 二级书架
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">像写书一样写博客</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            一级是书（Karios / 另一个项目），二级是章节。支持 Markdown、图片、Youtube、表格与代码。
          </p>
          <div className="mt-6 flex gap-2">
            <Link href="/books" className="inline-flex items-center gap-2 rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90">
              <Icon name="lucide:book-open" /> 去书架
            </Link>
            <Link href="/admin/login" className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-5 py-2.5 text-sm font-medium hover:bg-stone-50">
              <Icon name="lucide:pen-line" /> 去写作
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">书架</h2>
          <Link href="/books" className="text-xs text-[var(--muted)] hover:text-[var(--foreground)]">
            全部 →
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {books.map((b) => {
            const count = posts.filter((p) => (p.bookSlug ?? "karios") === b.slug).length;
            return (
              <Link key={b.slug} href={`/books/${b.slug}`}>
                <Card className="hover:border-[var(--accent)]/30">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <div className="flex items-center gap-2 font-medium">
                        <Icon name="lucide:book" size={14} /> {b.title}
                      </div>
                      <div className="text-xs text-[var(--muted)]">{b.description || `${count} 篇`}</div>
                    </div>
                    <Badge variant="outline">{count}</Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="latest">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">最新文章</h2>
          <span className="text-xs text-[var(--muted)]">{posts.length} 篇</span>
        </div>
        {posts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
              <Icon name="lucide:file-text" size={28} className="text-[var(--muted)]" />
              <p className="text-sm text-[var(--muted)]">还没有文章，去 Admin 新建第一篇</p>
              <Link href="/admin/login" className="text-sm font-medium text-[var(--accent)] hover:underline">
                进入 Admin →
              </Link>
            </CardContent>
          </Card>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {posts.map((p) => (
              <li key={p.slug} className="group">
                <Card className="h-full transition hover:border-[var(--accent)]/30 hover:shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                      <Icon name="lucide:calendar" size={12} /> {p.date}
                      {p.tags[0] && <Badge variant="outline" className="ml-1 text-[10px]">{p.tags[0]}</Badge>}
                    </div>
                    <Link href={`/posts/${p.slug}`} className="mt-2 block line-clamp-1 text-base font-medium group-hover:text-[var(--accent)]">
                      {p.title}
                    </Link>
                    <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{p.summary || "暂无摘要"}</p>
                    <Link href={`/posts/${p.slug}`} className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)]">
                      阅读 <Icon name="lucide:arrow-right" size={12} />
                    </Link>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
