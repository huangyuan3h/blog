import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog — 简洁 · 美观 · 通用",
  description: "一个基于 Next.js + shadcn + Cloudflare 的通用美观博客，支持 Markdown / 图片 / Youtube",
};

function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="/" className="text-sm font-semibold tracking-tight">
          Blog
        </a>
        <nav className="flex items-center gap-4 text-xs text-[var(--muted)]">
          <a href="/" className="hover:text-[var(--foreground)]">首页</a>
          <a href="/books" className="hover:text-[var(--foreground)]">书架</a>
          <a href="/admin/login" className="rounded-full border border-[var(--border)] bg-white px-3 py-1 hover:bg-stone-50">Admin</a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-[var(--muted)]">
      © {new Date().getFullYear()} Blog · Crafted with Next.js & shadcn
    </footer>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Header />
          <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
