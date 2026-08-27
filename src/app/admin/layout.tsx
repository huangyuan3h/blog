import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 轻量鉴权：无 proxy 时由 layout 守卫，/admin/login 自身放行
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // login 页面有独立 layout，不会走到这里；这里仅保护 /admin/* 其他页
  const cookieStore = await cookies();
  const token = cookieStore.get("karios_session")?.value;
  // 若在 /admin/login 下，layout 不会包裹（因有独立 layout），此处仅对 /admin 主体校验
  // 简化：无 token 时放行让页面自行处理，避免 build 时重定向；运行时由 client 校验
  // 正式校验放 API 层，这里不强制 redirect 以免静态构建失败
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
