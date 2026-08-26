import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolink from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

export async function MdxContent({ source }: { source: string }) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolink, { behavior: "wrap" })
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(source);

  return (
    <article
      className="prose prose-stone max-w-none prose-headings:tracking-tight prose-a:text-[var(--accent)] prose-img:rounded-xl prose-table:text-sm prose-th:bg-stone-50 prose-td:border prose-table:border"
      dangerouslySetInnerHTML={{ __html: String(file) }}
    />
  );
}
