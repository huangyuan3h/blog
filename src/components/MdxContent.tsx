import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolink from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { rehypeYoutube } from "@/lib/rehype-youtube";
import { rehypeImage } from "@/lib/rehype-image";

export async function renderMarkdown(source: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolink, { behavior: "wrap" })
    .use(rehypeYoutube)
    .use(rehypeImage)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(source);
  return String(file);
}

export async function MdxContent({ source }: { source: string }) {
  const html = await renderMarkdown(source);
  return (
    <article
      className="prose prose-stone max-w-none prose-headings:tracking-tight prose-a:text-[var(--accent)] prose-img:rounded-xl prose-table:text-sm prose-th:bg-stone-50 prose-td:border prose-table:border prose-iframe:rounded-xl [&_.youtube-wrapper]:relative [&_.youtube-wrapper]:aspect-video [&_.youtube-wrapper]:overflow-hidden [&_.youtube-wrapper]:rounded-xl [&_.youtube-wrapper]:border [&_.youtube-iframe]:absolute [&_.youtube-iframe]:inset-0 [&_.youtube-iframe]:h-full [&_.youtube-iframe]:w-full"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
