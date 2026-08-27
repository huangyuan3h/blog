import { describe, it, expect } from "vitest";
import { renderMarkdown } from "@/components/MdxContent";

describe("rehype-youtube", () => {
  it("bare youtube link -> iframe (nocookie)", async () => {
    const html = await renderMarkdown("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(html).toContain("youtube-nocookie.com/embed/dQw4w9WgXcQ");
    expect(html).toContain("youtube-wrapper");
  });
  it("youtu.be short link -> iframe", async () => {
    const html = await renderMarkdown("https://youtu.be/dQw4w9WgXcQ");
    expect(html).toContain("dQw4w9WgXcQ");
  });
  it("::youtube[ID] directive -> iframe", async () => {
    const html = await renderMarkdown("::youtube[dQw4w9WgXcQ]");
    expect(html).toContain("youtube-nocookie.com/embed/dQw4w9WgXcQ");
  });
  it("markdown image youtube -> iframe", async () => {
    const html = await renderMarkdown("![](https://www.youtube.com/watch?v=dQw4w9WgXcQ)");
    expect(html).toContain("youtube-nocookie");
  });
  it("normal image not converted", async () => {
    const html = await renderMarkdown("![alt](https://example.com/a.jpg)");
    expect(html).toContain('src="https://example.com/a.jpg"');
    expect(html).not.toContain("youtube");
  });
});
