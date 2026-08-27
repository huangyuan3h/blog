"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { Icon } from "@/components/ui/icon";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState(`> 演示：支持 **图片**、表格、代码、Youtube

## 表格

| 策略 | 收益 |
|---|---|
| S-3 | +43% |

## Youtube

https://www.youtube.com/watch?v=dQw4w9WgXcQ

## 图片

![示例](https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800)

\`\`\`python
print("hello")
\`\`\`
`);
  const [saving, setSaving] = useState(false);

  async function handleUpload(file: File): Promise<string> {
    // Phase 3 未接 R2 时，用临时 blob URL 预览；Phase3 接通后换 /api/admin/upload
    // 这里先走本地，真实上传后返回 url
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const data = await res.json();
      return data.url as string;
    }
    // fallback: 本地预览
    return URL.createObjectURL(file);
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-xl font-semibold flex items-center gap-2">
        <Icon name="lucide:file-plus" /> 新建文章
      </h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">基础信息</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label>标题</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="回测手记..." />
          </div>
          <div className="grid gap-2">
            <Label>Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="my-post" />
          </div>
          <div className="grid gap-2">
            <Label>摘要</Label>
            <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="一句话总结" rows={2} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Icon name="lucide:pen-line" /> Markdown 编辑器
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MarkdownEditor value={content} onChange={setContent} onUpload={handleUpload} />
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button disabled={saving} onClick={() => setSaving(true)}>
          <Icon name="lucide:save" /> 保存草稿
        </Button>
        <Button variant="secondary" disabled>
          <Icon name="lucide:send" /> 发布 (接 D1 后可用)
        </Button>
      </div>
    </div>
  );
}
