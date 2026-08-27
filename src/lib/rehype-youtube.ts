import type { Root, Element } from "hast";
import { visit } from "unist-util-visit";

const YT_ID_RE = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
const YT_DIRECTIVE_RE = /^::youtube\[([a-zA-Z0-9_-]{11})\]$/;

function extractId(url: string): string | null {
  const m = url.match(YT_ID_RE);
  if (m) return m[1];
  // bare ID?
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

export function rehypeYoutube() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (!parent || typeof index !== "number") return;

      // 1. ::youtube[ID] 在段落文本中 -> 替换整个段落
      if (node.tagName === "p" && node.children.length === 1 && node.children[0].type === "text") {
        const text = (node.children[0] as { value: string }).value.trim();
        const dm = text.match(YT_DIRECTIVE_RE);
        if (dm) {
          parent.children[index] = youtubeNode(dm[1]) as unknown as (typeof parent.children)[number];
          return;
        }
        const id = extractId(text);
        if (id && text.includes("youtu")) {
          parent.children[index] = youtubeNode(id) as unknown as (typeof parent.children)[number];
          return;
        }
      }

      // 2. <p><a href="youtube...">youtube...</a></p> 独占一行 -> 替换 p
      if (
        node.tagName === "p" &&
        node.children.length === 1 &&
        node.children[0].type === "element" &&
        (node.children[0] as Element).tagName === "a"
      ) {
        const a = node.children[0] as Element;
        const href = (a.properties?.href as string) ?? "";
        const id = extractId(href);
        if (id) {
          parent.children[index] = youtubeNode(id) as unknown as (typeof parent.children)[number];
          return;
        }
      }

      // 3. <img src="youtube..."> 视为 youtube (兼容 ![](youtube链接) 写法)
      if (node.tagName === "img") {
        const src = (node.properties?.src as string) ?? "";
        const id = extractId(src);
        if (id) {
          parent.children[index] = youtubeNode(id) as unknown as (typeof parent.children)[number];
        }
      }
    });
  };
}

function youtubeNode(id: string): Element {
  return {
    type: "element",
    tagName: "div",
    properties: { className: ["youtube-wrapper"] },
    children: [
      {
        type: "element",
        tagName: "iframe",
        properties: {
          src: `https://www.youtube-nocookie.com/embed/${id}`,
          title: "YouTube video player",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          allowFullscreen: true,
          loading: "lazy",
          frameBorder: "0",
          className: ["youtube-iframe"],
        },
        children: [],
      },
    ],
  };
}

// 供编辑器工具栏快速生成
export function youtubeMarkdown(idOrUrl: string): string {
  const id = extractId(idOrUrl) ?? idOrUrl.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return `::youtube[${id}]`;
  return id;
}
