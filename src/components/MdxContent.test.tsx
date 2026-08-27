import { describe, it, expect } from "vitest";
import { renderMarkdown } from "./MdxContent";

describe("MdxContent", () => {
  it("renders table (GFM)", async () => {
    const html = await renderMarkdown("| a | b |\n|---|---|\n| 1 | 2 |");
    expect(html).toContain("<table");
    expect(html).toContain("<th");
  });
  it("renders code block with highlight", async () => {
    const html = await renderMarkdown("```python\nprint(1)\n```");
    expect(html).toContain("hljs");
  });
  it("image has lazy loading", async () => {
    const html = await renderMarkdown("![x](https://example.com/x.jpg)");
    expect(html).toContain('loading="lazy"');
  });
  it("youtube + image coexistence", async () => {
    const md = `![a](https://example.com/a.jpg)\n\nhttps://youtu.be/dQw4w9WgXcQ\n\n| a | b |\n|---|---|\n|1|2|`;
    const html = await renderMarkdown(md);
    expect(html).toContain("youtube-nocookie");
    expect(html).toContain('src="https://example.com/a.jpg"');
    expect(html).toContain("<table");
  });
});
