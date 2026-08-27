"use client";
import { cn } from "@/lib/utils";
import * as Lucide from "lucide-react";
import { Icon as IconifyIcon } from "@iconify/react";

type LucideName = keyof typeof Lucide;

export function Icon({
  name,
  className,
  size = 16,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  // lucide:rocket | simple:github | iconify:tabler:star
  if (name.startsWith("iconify:")) {
    const icon = name.replace("iconify:", "");
    return <IconifyIcon icon={icon} width={size} height={size} className={cn(className)} />;
  }
  if (name.startsWith("lucide:")) {
    const key = name.replace("lucide:", "") as string;
    // kebab -> PascalCase e.g. arrow-up-right -> ArrowUpRight
    const pascal = key
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join("") as LucideName;
    const Cmp = (Lucide as Record<string, unknown>)[pascal] as React.ComponentType<{ className?: string; size?: number }>;
    if (Cmp) return <Cmp className={cn(className)} size={size} />;
  }
  // 直接 lucide name 兼容
  const Cmp = (Lucide as Record<string, unknown>)[name] as React.ComponentType<{ className?: string; size?: number }>;
  if (Cmp) return <Cmp className={cn(className)} size={size} />;
  return <Lucide.HelpCircle className={cn(className)} size={size} />;
}

// 常用品牌 icon 快捷 (simple-icons 需自行配色)
export const brandIcons = {
  github: "iconify:simple-icons:github",
  x: "iconify:simple-icons:x",
  cloudflare: "iconify:simple-icons:cloudflare",
} as const;
