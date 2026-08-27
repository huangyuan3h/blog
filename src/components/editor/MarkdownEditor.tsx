"use client";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { youtubeMarkdown } from "@/lib/rehype-youtube";

// dynamic 避免 SSR 报错 (codemirror 依赖 window)
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type Props = {
  value: string;
  onChange: (v: string) => void;
  onUpload?: (file: File) => Promise<string>; // 返回 url
};

export function MarkdownEditor({ value, onChange, onUpload }: Props) {
  const [ytOpen, setYtOpen] = useState(false);
  const [ytUrl, setYtUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const insertAtCursor = useCallback(
    (snippet: string) => {
      onChange(value ? `${value}\n\n${snippet}` : snippet);
    },
    [value, onChange],
  );

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || !onUpload) return;
      for (const f of Array.from(files)) {
        if (!f.type.startsWith("image/")) continue;
        const url = await onUpload(f);
        insertAtCursor(`![${f.name}](${url})`);
      }
    },
    [onUpload, insertAtCursor],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const onPaste = useCallback(
    (e: React.ClipboardEvent) => {
      handleFiles(e.clipboardData.files);
    },
    [handleFiles],
  );

  return (
    <div className="grid gap-2" onDrop={onDrop} onPaste={onPaste}>
      <div className="flex flex-wrap gap-2 rounded-lg border bg-card p-2">
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          <Icon name="lucide:image-plus" /> 插入图片
        </Button>
        <Button variant="outline" size="sm" onClick={() => setYtOpen((v) => !v)}>
          <Icon name="lucide:youtube" /> Youtube
        </Button>
        <Button variant="outline" size="sm" onClick={() => insertAtCursor("| 列1 | 列2 |\n|---|---|\n| A | B |")}>
          <Icon name="lucide:table" /> 表格
        </Button>
        <Button variant="outline" size="sm" onClick={() => insertAtCursor("```python\n# code\n```")}>
          <Icon name="lucide:code" /> 代码块
        </Button>
        <span className="ml-auto text-xs text-muted-foreground self-center hidden sm:inline">
          支持拖拽/粘贴上传图片 · 裸 Youtube 链接自动转 iframe
        </span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {ytOpen && (
        <div className="flex gap-2 rounded-lg border bg-card p-3">
          <Input placeholder="粘贴 Youtube 链接或 11位ID，如 https://youtu.be/dQw4w9WgXcQ" value={ytUrl} onChange={(e) => setYtUrl(e.target.value)} />
          <Button
            onClick={() => {
              if (!ytUrl.trim()) return;
              insertAtCursor(youtubeMarkdown(ytUrl));
              setYtUrl("");
              setYtOpen(false);
            }}
          >
            插入
          </Button>
          <Button variant="ghost" onClick={() => setYtOpen(false)}>
            取消
          </Button>
        </div>
      )}

      <div data-color-mode="light" className="overflow-hidden rounded-xl border">
        <MDEditor value={value} onChange={(v) => onChange(v ?? "")} height={480} preview="live" visibleDragbar={false} />
      </div>
      <p className="text-xs text-muted-foreground">
        预览与前台 <code>MdxContent</code> 同管道：GFM 表格/任务列表、代码高亮、图片懒加载、Youtube 响应式 16:9。R2 图片建议用 <code>/media/*</code> 地址。
      </p>
    </div>
  );
}
