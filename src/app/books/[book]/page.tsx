import Link from "next/link";
import { getAllBooks, getPostsByBook } from "@/lib/posts";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

export function generateStaticParams() {
  return getAllBooks().map((b) => ({ book: b.slug }));
}

export default async function BookPage({ params }: { params: Promise<{ book: string }> }) {
  const { book } = await params;
  const posts = getPostsByBook(book);
  return (
    <div className="flex flex-col gap-6">
      <Link href="/books" className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] flex items-center gap-1">
        <Icon name="lucide:arrow-left" size={12} /> 书架
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">{book}</h1>
      {posts.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-[var(--muted)]">此书暂无文章</p>
      ) : (
        <ol className="grid gap-3">
          {posts
            .sort((a, b) => a.order - b.order)
            .map((p, idx) => (
              <li key={p.slug}>
                <Link href={`/books/${book}/${p.slug}`} className="group">
                  <Card className="hover:border-[var(--accent)]/30">
                    <CardContent className="flex gap-4 p-4">
                      <span className="text-xs text-[var(--muted)] w-8 pt-1">#{idx + 1}</span>
                      <div className="flex-1">
                        <div className="font-medium group-hover:text-[var(--accent)]">{p.title}</div>
                        <div className="text-xs text-[var(--muted)] line-clamp-1">{p.summary}</div>
                      </div>
                      <Icon name="lucide:chevron-right" className="text-[var(--muted)]" />
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
        </ol>
      )}
    </div>
  );
}
