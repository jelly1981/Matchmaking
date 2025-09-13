# Matchmaking Service Static Site (Astro + Tailwind + TypeScript)

静态站点，使用 Astro 生成（SSG），样式由 Tailwind CSS 驱动，全部页面在构建时输出纯静态 HTML/CSS/JS。This is the Matchmaking Service website.

## 📁 结构
```
src/
	layouts/BaseLayout.astro
	pages/index.astro
	pages/about.astro
	styles/global.css
public/
astro.config.mjs
tailwind.config.js
postcss.config.js
```

## 🚀 常用命令
```bash
npm install        # 安装依赖
npm run dev        # 本地开发 (默认 http://localhost:4321)
npm run build      # 生成静态文件到 dist/
npm run preview    # 预览 build 结果
```

## 🎨 Tailwind 使用
全局样式：`src/styles/global.css`（在布局中引入）。
配置文件：`tailwind.config.js`，可在 `theme.extend` 中扩展定制。

示例组件/布局：`src/layouts/BaseLayout.astro`。

## ➕ 新增页面
在 `src/pages` 下新增 `xxx.astro` 或 `xxx.md` 即自动成为路由。

## 🔧 修改包名
当前包名：`matchmaking-service-site`，可在 `package.json` 中调整。

## 📦 部署
构建后将 `dist/` 目录上传至任意静态托管（GitHub Pages / Vercel / Netlify / OSS 等）。

## ✅ 待办/可改进
- 添加 SEO 组件
- 添加 sitemap、robots.txt
- 集成 ESLint 与 Prettier
- 引入内容数据（如 Markdown 博客）

欢迎继续扩展。 
