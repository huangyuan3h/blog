# Karios Blog — 饱满化改造 TODO (Cloudflare 全免费栈)

> 目标：从静态 `content/posts/*.md` -> `Workers + D1 + R2` 动态博客，支持 Admin 登录/发文/Markdown 编辑/上传，美化为 shadcn 皮肤 + 扩展 Icon 体系。全部 Free Tier，零成本。

## 架构总览

```
Browser -> Cloudflare Workers (opennextjs-cloudflare, Next.js 16 SSR)
           ├─ / (SSR/ISR) 读 D1
           ├─ /api/auth/* + middleware 鉴权
           ├─ /api/admin/* (写 D1 + R2)
           ├─ D1: posts/tags/media/users/sessions (Drizzle ORM)
           ├─ R2: karios-blog-media (图床)
           └─ Turnstile (可选, Free)
```

---

## Phase 1 — 基础设施 [P0] ✅ 已完成 (2026-08-27)

- [x] 1.1 移除 `next.config.ts:4` `output:"export"` / `images.unoptimized`，启用 `opennextjs-cloudflare` Workers 适配 -> 新增 `open-next.config.ts`
- [x] 1.2 重写 `wrangler.toml:1`：绑定 `d1_database (karios-blog-db)` + `r2_bucket (karios-blog-media)`，删 `pages_build_output_dir`
- [x] 1.3 安装依赖：`drizzle-orm drizzle-kit` + `drizzle.config.ts` + `src/server/db/schema.ts` + `src/server/db/index.ts`
- [x] 1.4 建表 SQL：`posts / tags / post_tags / media / users / sessions`，`wrangler d1 create` + 本地/远端迁移 -> `drizzle/0000_low_ultimatum.sql` 已生成
- [x] 1.5 Seed 脚本：`content/posts/*.md` -> D1 (`pnpm db:seed`)，保留回退逻辑 -> `src/server/db/migrate.ts`
- [x] 1.6 重构 `src/lib/posts.ts:18` `getAllPosts/getPost` 双源：优先 D1，无 D1 时回退读文件 -> 新增 `getAllPostsAsync/getPostAsync`
- [x] 1.7 初始化 shadcn/ui：`pnpm dlx shadcn@latest init` (New York, zinc base, orange accent)，建立 `src/components/ui/*` + `src/lib/utils.ts` + `components.json`
- [x] 1.8 主题 token：`src/app/globals.css:4` 扩展 shadcn 变量 + `next-themes` 明暗切换 -> `src/components/theme-provider.tsx` + `src/app/layout.tsx:4` 包裹

## Phase 2 — 认证与 Admin 壳 [P0] 🚧 进行中

- [x] 2.1 Auth 方案：单管理员 `ADMIN_USERNAME` + `ADMIN_PASSWORD_HASH` (bcrypt) 存 `wrangler secret`，`jose` 签 JWT httpOnly cookie -> `src/server/auth/jwt.ts` + `src/server/auth/config.ts`
- [x] 2.2 路由：`src/app/(auth)/admin/login/page.tsx` + `src/app/api/auth/login|logout/route.ts` -> `src/app/admin/login/page.tsx:1` + `src/app/api/auth/login/route.ts:1`
- [x] 2.3 中间件：`src/proxy.ts:6` 保护 `/admin/*` + `/api/admin/*` (已迁 middleware->proxy)
- [ ] 2.4 可选：Cloudflare Turnstile 无感验证 + 登录限流
- [x] 2.5 Admin 布局：`src/app/admin/layout.tsx:1` Sidebar/Header + `src/app/admin/page.tsx:1` Dashboard 统计 (shadcn Card/Button/Icon)

## Phase 3 — 内容闭环 (编辑+上传) [P0]

- [ ] 3.1 R2 上传：`POST /api/admin/upload` 校验 mime/size -> `R2.put(media/2026/08/uuid.ext)` -> 返回 url；`GET /media/*` 透传 + Cache-Control (支持图片 `![alt](r2Url)` 全链路)
- [ ] 3.2 媒体库：`src/app/admin/media/page.tsx` 网格 + 删除 + 复制链接 (UploadDropzone, sonner)
- [ ] 3.3 Markdown 编辑器：`@uiw/react-md-editor` (CodeMirror6 底座) 分栏，沿用 `remark-gfm/rehype-*` 渲染，支持粘贴/拖拽上传自动插入 `![](R2url)`，工具栏含 Youtube/图片/表格/代码；预览与 `MdxContent` 同管道保证所见即所得
- [ ] 3.4 文章 CRUD：`src/app/admin/posts/*` 列表/新建/编辑/草稿/发布 (`status` draft/published)，`src/app/api/admin/posts/*` — 需支持选择 `book` 与 `order` 二级结构
- [ ] 3.5 前台改读 D1：`src/app/page.tsx:5` + `src/app/posts/[slug]/page.tsx:5` SSR + ISR (`revalidate` 或 `cacheTag`)，草稿预览 `?preview` + cookie
- [ ] 3.6 兼容：保留 `MdxContent.tsx:10` 渲染管道，增加 TOC 锚点 + Youtube/图片增强 (见 Phase 7)
- [x] 3.7 二级书架：`books` 表 (`src/server/db/schema.ts:4`) + `posts.book_id/order` + `drizzle/0001_little_ink.sql` + `src/lib/posts.ts:7` BookMeta + `/books` `/books/[book]` `/books/[book]/[slug]` (像写书)

## Phase 4 — 前台抛光与体验 [P1]

- [ ] 4.1 前台重做：hero 保留但用 `Card/Badge/Input`，列表筛选/搜索(D1 LIKE)、标签页、分页
- [ ] 4.2 详情页：`prose` 升级 + 自动 TOC + 代码复制按钮 + 上一篇/下一篇
- [ ] 4.3 SEO：`sitemap.ts` + `robots.ts` + `feed.xml (RSS)` + OG 图 + `metadata` 动态
- [ ] 4.4 性能：R2 图片 `next/image` (remotePatterns) 或 Worker 缓存，`loading.tsx` / `error.tsx`

## Phase 5 — Icon 体系扩展 [P1] ✅ 底座已完成

- [x] 5.1 底座：`lucide-react` (shadcn 默认, ~1300)
- [x] 5.2 扩展：`simple-icons` (2800+ 品牌) + `@iconify/react` 按需 (Hugeicons/Tabler/Remix)
- [x] 5.3 封装：`src/components/ui/icon.tsx:1` 统一 `<Icon name="lucide:rocket|simple:github|iconify:tabler:star" />` + size/color 变体
- [ ] 5.4 Admin Icon Picker：`cmdk` Command 搜索弹窗，供编辑器/标签/导航选用
- [ ] 5.5 全量替换：导航/卡片/空状态/工具栏/社交/GitHub 链接

## Phase 6 — 部署与收尾 [P1]

- [ ] 6.1 GitHub Actions：`Deploy to Cloudflare Pages` 改 `opennextjs-cloudflare build && deploy`，绑定 D1/R2 secrets
- [ ] 6.2 本地验证：`pnpm preview` + `wrangler d1 execute --local` 自检
- [ ] 6.3 文档：`README.md` 更新架构与 Free 额度说明，`docs/deploy.md` 可选

## Phase 7 — 富媒体 + 测试 (新增) [P0]

### 7a 富媒体 (图片 / Youtube) — Free 栈
- [ ] 7.1 图片：`MdxContent.tsx:10` 已支持 `![alt](url)`，补充 `rehype` 图片包装 (figure/figcaption, lazy, 圆角, lightbox 预留) + R2 `/media/*` 透传 + `next/image` remotePatterns；编辑器拖拽/粘贴自动上传 R2 并插 `![](url)`；支持外链校验与尺寸回写
- [ ] 7.2 Youtube：支持三种写法自动转响应式 iframe (16:9, lazy, nocookie)：
  - 裸链接独占一行：`https://www.youtube.com/watch?v=dQw4w9WgXcQ` / `https://youtu.be/dQw4w9WgXcQ`
  - Markdown 图片语法：`![](https://www.youtube.com/watch?v=...)`
  - 显式指令：`::youtube[dQw4w9WgXcQ]` 或 ````youtube dQw4w9WgXcQ ````
  - 实现：`src/lib/remark-youtube.ts` (remark) 或 `src/lib/rehype-youtube.ts` (rehype) 将链接段落转为 `<div class="youtube"><iframe ...>`，编辑器工具栏一键插入
- [ ] 7.3 验收：`content/posts/hello-world.md` 追加 youtube/图片混合用例，前台与编辑器预览一致，无 CLS

### 7b 测试 — FE 60% / BE 90% (vitest + @testing-library, 免费)
- [ ] 7.4 基座：`vitest.config.ts` + `vitest.setup.ts` (jsdom)，`@vitest/coverage-v8`，`jsdom` + `@testing-library/react/jest-dom` + `msw`；区分 FE/BE 项目阈值
  - FE (60%)：`src/components/**` `src/app/**` `src/lib/**` (含 `MdxContent`, `Icon`, `utils`, Editor)
  - BE (90%)：`src/server/**` `src/app/api/**` `src/proxy.ts` (auth/jwt, D1 CRUD, 上传校验, 鉴权)
- [ ] 7.5 用例清单 (先骨架，后补量)：
  - BE 90%：`src/server/auth/jwt.test.ts` (签/验/过期), `src/server/auth/config.test.ts`, `src/app/api/auth/login/route.test.ts` (成功/失败/无 hash 回退), `src/lib/posts.test.ts` (fs 回退/排序), `src/lib/rehype-youtube.test.ts`
  - FE 60%：`src/components/ui/*` 快照, `src/components/MdxContent.test.tsx` (表格/代码/图片/youtube), `src/components/ui/icon.test.tsx` (lucide/iconify 回退), `src/app/admin/login/page.test.tsx`
- [ ] 7.6 CI：`pnpm test -- --coverage` + `pnpm test:ci` 门禁，`package.json` 新增 `test` / `test:coverage` / `coverage` 阈值检查，GitHub Actions 加 `pnpm test` 步骤 (Free runner)
- [ ] 7.7 工具：`eslint` 保留，`prettier` 可选；覆盖率报告 `coverage/` 入 `.gitignore`

---

## Free 额度核对

| 资源 | Free 额度 | 本项目消耗 | 风险 |
|------|-----------|------------|------|
| Workers | 10万 req/天 | ~5k PV | 绿 |
| D1 读/写/存储 | 5M读/10万写/5GB | 读 ~10k/天 | 绿 |
| R2 存储/请求 | 10GB/10M A+10M B | ~2GB | 绿 |
| Pages 带宽 | 无限 | - | 绿 |

超限不扣费仅 429。

## 验收标准

- [ ] `pnpm build && pnpm preview` 通过，本地 D1 读写正常
- [ ] `/admin/login` 登录 -> JWT cookie -> 访问 `/admin` 成功，未登录重定向
- [ ] Admin 可新建/编辑/发布文章，粘贴图片自动上传 R2 并插入 Markdown，Youtube 三写法均渲染为响应式 iframe
- [ ] 前台列表/详情实时读 D1，支持明暗主题与响应式，图片懒加载无 CLS
- [ ] Icon 覆盖导航/内容/管理后台，无缺失
- [ ] `pnpm test -- --coverage` 通过：FE ≥60% / BE ≥90% (vitest coverage-v8)，CI 门禁生效

## 下一步

按 `Phase 1 -> 2 -> 3` 顺序执行，当前进度 Phase 1 ✅ / Phase 2 🚧 / Phase 5 底座 ✅，下一步进入 Phase 3。

**本地验证**：`pnpm build` 已通过 (含 proxy 鉴权)。需 `wrangler d1 create karios-blog-db` 替换 `wrangler.toml:database_id` 后执行 `wrangler d1 execute` 应用 `drizzle/0000_low_ultimatum.sql`，再 `opennextjs-cloudflare preview` 验证。
