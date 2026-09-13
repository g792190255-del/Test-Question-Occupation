# 测试记录与统计

项目：`gkpgytudgzbajpngqgdz`（职业测试）。已应用 `migrations/202609130001_holland_results.sql`。

在 [Supabase Table Editor](https://supabase.com/dashboard/project/gkpgytudgzbajpngqgdz/editor) 打开 `holland_results` 查看原始记录：角色、标题、三个关键词、六维总分和均分、所有兴趣答案及优势自评、同分偏好、完成时间。时间按 UTC 保存，`created_at` 是数据库接收时间。`holland_roles` 保存 15 种原创角色。

网页先显示报告，再调用 `save_holland_result`。同一份报告的刷新、重试沿用 `run_id`，不会新增测试次数；修改优势自评更新原记录，修改兴趣答案或结果角色生成新记录。个人标识来自浏览器本地存储，仅用于估算参与人数，并非核验身份。

`holland_statistics` 仅返回聚合值。人数按每位匿名参与者最近保存的报告分组；测试次数包含其全部记录。支持 `all`、`brief`、`full` 筛选。页面页脚及结果页均有统计入口。

## 访问设计

网页只包含可公开的 Publishable key。两个表开启 RLS，撤销访客和登录角色的所有直接表权限。访客仅能调用两个指定 RPC：保存自己的报告及读取聚合统计。数据库重新计算分数并验证角色；更新需匹配随机写入凭证，数据库只存其 SHA-256。没有个人答案读取接口。

匿名 RPC 的 `SECURITY DEFINER` 与“RLS 已开启但无策略”是此设计的预期审计提示，并不表示原始答案向访客开放。两个函数固定空 `search_path` 并显式限定表名。相关解释：[匿名函数执行审计](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable)、[RLS 无策略审计](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy)。公开收集接口无法证明提交者是真实独立的人；如未来公开大规模运营，可增加服务端限流及机器人验证。

## 验证

- 单元测试 `tests/report-records.test.mjs`：身份稳定、失败重试、队列排序、超时、公开密钥校验。
- `tests/ui-v4.cjs`：两套完整答题流程、同分确认、职业和薪资、移动端；模拟保存，避免污染数据库。
- `tests/cloud-ui.cjs`：真实数据库联调，记录生成的测试 ID 到 `output/live-test-ids.json`。测试后仅删除这些 ID 对应的测试记录。
- 已在数据库事务中验证全部 15 角色 × 两版本，重复提交、错误角色、非法答案、错误写入凭证及访客读取拦截，随后回滚全部测试数据。
