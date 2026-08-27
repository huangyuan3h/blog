import Link from "next/link";
import { getAllBooks, getAllPosts } from "@/lib/posts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";

export default function BooksPage() {
  const books = getAllBooks();
  const posts = getAllPosts();
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold tracking-tight">书架</h1>
      <p className="text-sm text-[var(--muted)]">每本书是一个二级分类，像写书一样组织文章。例：Karios / 另一个项目。</p>
      <div className="grid gap-4 md:grid-cols-2">
        {books.map((b) => {
          const count = posts.filter((p) => (p.bookSlug ?? "karios") === b.slug).length;
          return (
            <Link key={b.slug} href={`/books/${b.slug}`}>
              <Card className="h-full hover:border-[var(--accent)]/30 hover:shadow-sm transition">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="lucide:book-open" /> {b.title}
                  </CardTitle>
                  <CardDescription>{b.description || `共 ${count} 篇`}</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-[var(--muted)] flex gap-2">
                  <Badge variant="secondary">{count} 篇</Badge>
                  <span className="inline-flex items-center gap-1">
                    <Icon name="lucide:arrow-right" size={12} /> 进入
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
