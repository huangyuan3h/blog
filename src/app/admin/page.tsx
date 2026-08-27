import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function AdminPage() {
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Icon name="lucide:sparkles" /> 仪表盘
        </h1>
        <Link href="/admin/posts/new">
          <Button>
            <Icon name="lucide:plus" /> 新建文章
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Icon name="lucide:database" /> D1
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">posts / tags / media / users</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Icon name="lucide:hard-drive" /> R2
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">karios-blog-media · 10GB Free</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Icon name="lucide:palette" /> 外观
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">shadcn New York · zinc + orange</CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          下一步：Phase 3 实现 Posts CRUD + Markdown 编辑器 + R2 上传。当前可先用 `content/posts/*.md` seed 到 D1 验证。
        </CardContent>
      </Card>
    </div>
  );
}
