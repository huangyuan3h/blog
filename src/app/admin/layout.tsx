import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between rounded-xl border bg-card p-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold">
            <Icon name="lucide:layout-dashboard" /> Admin
          </Link>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/admin" className="hover:text-foreground flex items-center gap-1">
              <Icon name="lucide:file-text" size={14} /> 文章
            </Link>
            <Link href="/admin/media" className="hover:text-foreground flex items-center gap-1">
              <Icon name="lucide:image" size={14} /> 媒体
            </Link>
            <Link href="/" className="hover:text-foreground flex items-center gap-1">
              <Icon name="lucide:external-link" size={14} /> 前台
            </Link>
          </nav>
        </div>
        <form action="/api/auth/logout" method="post">
          <Button variant="ghost" size="sm">
            <Icon name="lucide:log-out" /> 退出
          </Button>
        </form>
      </div>
      {children}
    </div>
  );
}
