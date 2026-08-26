import { getAllPosts, getPost } from "@/lib/posts";
import { MdxContent } from "@/components/MdxContent";
import Link from "next/link";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return <div className="text-sm text-[var(--muted)]">未找到文章</div>;
  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/" className="text-xs text-[var(--muted)] hover:text-[var(--foreground)]">← 返回</Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">{post.title}</h1>
      <div className="mt-1 text-xs text-[var(--muted)]">{post.date} · {post.tags.join(" · ")}</div>
      {post.cover && <img src={post.cover} alt={post.title} className="mt-6 w-full rounded-xl border border-[var(--border)]" />}
      <div className="mt-6 rounded-xl border border-[var(--border)] bg-white p-6">
        {await MdxContent({ source: post.content })}
      </div>
    </article>
  );
}
