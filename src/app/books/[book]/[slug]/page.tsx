import { getPost, getPostsByBook } from "@/lib/posts";
import { MdxContent } from "@/components/MdxContent";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function generateStaticParams() {
  // 为每本书生成静态路径，兼容本地 dev
  const books = ["karios"];
  return books.flatMap((b) => getPostsByBook(b).map((p) => ({ book: b, slug: p.slug })));
}

export default async function BookPostPage({ params }: { params: Promise<{ book: string; slug: string }> }) {
  const { book, slug } = await params;
  const post = getPost(slug);
  if (!post) return <div className="text-sm text-[var(--muted)]">未找到文章</div>;
  const bookPosts = getPostsByBook(book).sort((a, b) => a.order - b.order);
  const idx = bookPosts.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? bookPosts[idx - 1] : null;
  const next = idx >= 0 && idx < bookPosts.length - 1 ? bookPosts[idx + 1] : null;
  return (
    <article className="mx-auto max-w-3xl">
      <Link href={`/books/${book}`} className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] inline-flex items-center gap-1">
        <Icon name="lucide:arrow-left" size={12} /> {book}
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">{post.title}</h1>
      <div className="mt-1 text-xs text-[var(--muted)]">
        {post.date} · #{idx + 1} / {bookPosts.length}
      </div>
      {post.cover && <img src={post.cover} alt={post.title} className="mt-6 w-full rounded-xl border" />}
      <div className="mt-6 rounded-xl border bg-white p-6">{await MdxContent({ source: post.content })}</div>
      <div className="mt-8 flex justify-between gap-4 text-sm">
        {prev ? (
          <Link href={`/books/${book}/${prev.slug}`} className="inline-flex items-center gap-1 hover:text-[var(--accent)]">
            <Icon name="lucide:chevron-left" size={14} /> {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/books/${book}/${next.slug}`} className="inline-flex items-center gap-1 hover:text-[var(--accent)]">
            {next.title} <Icon name="lucide:chevron-right" size={14} />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </article>
  );
}
