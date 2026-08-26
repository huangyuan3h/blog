import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Karios Lab — 回测手记",
  description: "从单市场到多资产，记录每一次 walk-forward 与真实交易的距离",
};

function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="/" className="text-sm font-semibold tracking-tight">
          Karios Lab<span className="ml-2 text-xs font-normal text-[var(--muted)]">回测手记</span>
        </a>
        <nav className="flex gap-4 text-xs text-[var(--muted)]">
          <a href="/" className="hover:text-[var(--foreground)]">文章</a>
          <a href="https://github.com/huangyuan3h/blog" className="hover:text-[var(--foreground)]">GitHub</a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-8 text-center text-xs text-[var(--muted)]">
      部署于 Cloudflare Pages · 免费架构 · 图片/表格全支持
    </footer>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
