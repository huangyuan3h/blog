import type { Root, Element } from "hast";
import { visit } from "unist-util-visit";

export function rehypeImage() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "img") return;
      // 懒加载 + 圆角由 prose 处理，这里只补属性
      node.properties = node.properties || {};
      if (!node.properties.loading) node.properties.loading = "lazy";
      if (!node.properties.decoding) node.properties.decoding = "async";
      // 外链图加 referrerPolicy
      if (typeof node.properties.src === "string" && node.properties.src.startsWith("http")) {
        node.properties.referrerPolicy = "no-referrer";
      }
    });
  };
}
