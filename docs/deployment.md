# 兴趣坐标 · 服务器部署说明

## 上传方法

1. 下载 `holland-site-v6-deploy.zip`。
2. 在服务器上创建一个静态网站，将压缩包解压到网站根目录。解压后，根目录应直接包含 `index.html`、`assets/` 和各个 `.mjs` 文件。
3. 配置域名和 HTTPS，默认首页设为 `index.html`。
4. 确认服务器对 `.mjs` 文件返回 JavaScript 类型，例如 `Content-Type: application/javascript`，否则浏览器无法加载答题程序。
5. 打开网站，分别完成简约版、完整版测试；看到“测试结果已保存”后，在页脚“数据统计”中核对数据。

这是可直接部署的静态网站，不需要 npm 安装、Node.js 常驻服务、PHP 或再次构建。页面通过 URL 的 `#home`、`#test`、`#result`、`#stats` 切换，不需要为这些页面配置服务端路由。

请通过 HTTPS 使用正式域名访问。不要直接双击本地 HTML；远程 HTTP 页面无法使用保存记录所需的浏览器安全功能。

## 数据库

已配置现有 Supabase 项目“职业测试”：`gkpgytudgzbajpngqgdz`。迁移到自建服务器后，仍保存到同一个数据库，不必重新建表，也无需导入历史数据。

`supabase-config.mjs` 仅包含项目地址及可公开的 Publishable key。不要把管理令牌、Secret key 或 service_role 密钥上传到网站目录。

管理员在 https://supabase.com/dashboard/project/gkpgytudgzbajpngqgdz/editor 的 `holland_results` 表查看记录。统计模块打开时及手动刷新时读取最新汇总，不会自动实时推送更新。

## 服务器设置与验收

- 网站根目录直接访问应显示首页，15 张角色图片应正常显示。
- `.mjs`、`.css`、`.png`、`.svg` 文件均应返回成功状态，不能被服务器当成附件下载。
- 若服务器配置了 Content-Security-Policy，需允许连接 `https://gkpgytudgzbajpngqgdz.supabase.co`；现有页面也使用内联样式设置分数和分布条宽度。
- 原 Sites 平台的仅所有者可访问设置不会随 ZIP 迁移；自建服务器需要自行配置访问范围。当前题目来源与开发试用说明保留在 `sources.html` 中。
- 保存失败时报告仍会保留，可点击“重试保存”。先检查 HTTPS、浏览器控制台以及到 Supabase 的网络连通性。
- 上传更新时完整替换网站文件，避免新旧脚本混用；如有 CDN 或服务端缓存，需要刷新缓存。

部署包包含当前已验证的网页与角色图片，不包含本机预览服务、测试数据、Git 历史、管理凭据或数据库备份。
