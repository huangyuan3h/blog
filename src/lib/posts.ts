import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export type BookMeta = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover?: string;
  order: number;
};

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  cover?: string;
  bookId?: string | null;
  bookSlug?: string | null;
  order: number;
};

export type Post = PostMeta & { content: string };

// 兼容：content/posts/*.md 的 frontmatter 可写 book: karios
function inferBookFromFs(data: Record<string, unknown>): { bookSlug: string | null; order: number } {
  return {
    bookSlug: (data.book as string) ?? (data.bookSlug as string) ?? null,
    order: (data.order as number) ?? 0,
  };
}

// 文件回退（本地 dev 无 D1 时用）
function getAllPostsFromFs(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { data } = matter(raw);
    const { bookSlug, order } = inferBookFromFs(data as Record<string, unknown>);
    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "2026-01-01",
      summary: data.summary ?? "",
      tags: data.tags ?? [],
      cover: data.cover,
      bookSlug,
      bookId: bookSlug,
      order,
    } as PostMeta;
  });
  return posts.sort((a, b) => {
    if (a.bookSlug !== b.bookSlug) return (a.bookSlug ?? "").localeCompare(b.bookSlug ?? "");
    if (a.order !== b.order) return a.order - b.order;
    return a.date < b.date ? 1 : -1;
  });
}

function getPostFromFs(slug: string): Post | null {
  const file = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);
  const { bookSlug, order } = inferBookFromFs(data as Record<string, unknown>);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "2026-01-01",
    summary: data.summary ?? "",
    tags: data.tags ?? [],
    cover: data.cover,
    bookSlug,
    bookId: bookSlug,
    order,
    content,
  };
}

export function getBooksFromFs(): BookMeta[] {
  const posts = getAllPostsFromFs();
  const map = new Map<string, BookMeta>();
  for (const p of posts) {
    if (!p.bookSlug) continue;
    if (!map.has(p.bookSlug)) {
      map.set(p.bookSlug, {
        id: p.bookSlug,
        slug: p.bookSlug,
        title: p.bookSlug === "karios" ? "Karios" : p.bookSlug,
        description: "",
        order: 0,
      });
    }
  }
  // 保证至少有示例两本书
  if (!map.has("karios")) map.set("karios", { id: "karios", slug: "karios", title: "Karios", description: "回测手记", order: 0 });
  return Array.from(map.values()).sort((a, b) => a.order - b.order);
}

// D1 优先，失败回退文件（保证 `next build` 不依赖 D1 也能过）
export async function getAllPostsAsync(): Promise<PostMeta[]> {
  try {
    const { getDb } = await import("@/server/db");
    const db = getDb();
    if (db) {
      const rows = await db.query.posts.findMany({ orderBy: (p, { desc }) => [desc(p.publishedAt)] });
      return rows
        .filter((r) => r.status === "published")
        .map((r) => ({
          slug: r.slug,
          title: r.title,
          date: r.publishedAt ?? r.createdAt.slice(0, 10),
          summary: r.summary,
          tags: [],
          cover: r.coverUrl ?? undefined,
          bookId: (r as unknown as { bookId?: string }).bookId ?? null,
          bookSlug: (r as unknown as { bookId?: string }).bookId ?? null,
          order: (r as unknown as { order?: number }).order ?? 0,
        }));
    }
  } catch {}
  return getAllPostsFromFs();
}

export async function getBooksAsync(): Promise<BookMeta[]> {
  try {
    const { getDb } = await import("@/server/db");
    const db = getDb() as unknown as { query: { books: { findMany: (o: unknown) => Promise<BookMeta[]> } } } | null;
    if (db) {
      const rows = await db.query.books.findMany({ orderBy: (b: unknown, { asc }: { asc: (c: unknown) => unknown }) => [asc((b as { order: unknown }).order)] } as unknown);
      if (rows.length) return rows as BookMeta[];
    }
  } catch {}
  return getBooksFromFs();
}

export async function getPostAsync(slug: string): Promise<Post | null> {
  try {
    const { getDb } = await import("@/server/db");
    const db = getDb();
    if (db) {
      const row = await db.query.posts.findFirst({ where: (p, { eq }) => eq(p.slug, slug) });
      if (row)
        return {
          slug: row.slug,
          title: row.title,
          date: row.publishedAt ?? row.createdAt.slice(0, 10),
          summary: row.summary,
          tags: [],
          cover: row.coverUrl ?? undefined,
          bookId: (row as unknown as { bookId?: string }).bookId ?? null,
          bookSlug: (row as unknown as { bookId?: string }).bookId ?? null,
          order: (row as unknown as { order?: number }).order ?? 0,
          content: row.content,
        };
    }
  } catch {}
  return getPostFromFs(slug);
}

// 同步兼容层：前台静态生成仍可用，优先走文件
export function getAllPosts(): PostMeta[] {
  return getAllPostsFromFs();
}

export function getPost(slug: string): Post | null {
  return getPostFromFs(slug);
}

export function getAllBooks(): BookMeta[] {
  return getBooksFromFs();
}

export function getPostsByBook(bookSlug: string): PostMeta[] {
  return getAllPostsFromFs().filter((p) => (p.bookSlug ?? "karios") === bookSlug);
}
