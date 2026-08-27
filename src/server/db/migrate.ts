import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export function seedFromFiles() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      id: slug,
      slug,
      title: data.title ?? slug,
      summary: data.summary ?? "",
      content,
      coverUrl: data.cover ?? null,
      coverR2Key: null,
      status: "published",
      publishedAt: data.date ?? new Date().toISOString().slice(0, 10),
    };
  });
}
