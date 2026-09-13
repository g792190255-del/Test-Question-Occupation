# Test Question: Occupation

兴趣坐标：霍兰德职业兴趣测试网站。包含简约版与完整版问卷、15 种原创角色、职业薪资参考、Supabase 结果保存及角色分布统计。

- 网站文件：`dist/`，可直接部署为 HTTPS 静态网站。
- 本地预览：运行 `node preview.mjs`，访问 `http://127.0.0.1:4173/`。
- [服务器部署说明](docs/deployment.md)
- [数据库结构与管理说明](supabase/README.md)
- 数据库仍连接现有 Supabase 项目；仓库不包含用户测试数据或数据库管理凭据。

Mobile-first Holland RIASEC career-interest exploration site. `dist/` contains the deployable static site.

## Versions

- Brief: 18 original interest items, 3 per domain, followed by 2 self-reported skills/evidence items.
- Full: all 60 activities in the O*NET® Interest Profiler Short Form paper instrument, with original English and a Chinese reference translation. Skills self-report is optional and separate.

Source: https://www.onetcenter.org/dl_tools/ipsf/Interest_Profiler.pdf

## Modifications and disclaimers

This application includes information from the O*NET Career Exploration Tools by the U.S. Department of Labor, Employment and Training Administration (USDOL/ETA). Used under the O*NET Tools Developer License (https://www.onetcenter.org/license_toolsdev.html). O*NET® is a trademark of USDOL/ETA. 兴趣坐标 has modified all or some of this information. USDOL/ETA has not approved, endorsed, or tested these modifications.

Modifications: Chinese reference translations; a five-point response presentation instead of the paper instrument's checklist (the official online instrument uses five-point responses); software presentation; optional separate skills self-report; original two-interest role illustrations. English item content is retained in full. This is a private evaluation prototype. The Chinese adaptation has NOT completed psychometric validation. Do not introduce the adapted questionnaire publicly before the validation study required by the developer license. Automated software tests do not constitute psychometric validation.

兴趣坐标 has modified a portion of the O*NET® Career Exploration Tools. The U.S. Department of Labor, Employment and Training Administration (USDOL/ETA) has not approved, endorsed, or tested these modifications. As such, USDOL/ETA will not be liable to any third party or end-user for any damages arising out of or from the use or misuse of the modified O*NET Career Exploration Tools or any products incorporating or containing the modified O*NET Career Exploration Tools.

## Scoring

Answers use 1–5; missing values are rejected rather than coerced to zero. Results show each domain's average and raw sum. Ties at the top-two boundary require an explicit user preference confirmation. It selects a primary role without altering recorded scores. Skills responses never modify interest scores.

## Local commands

`node preview.mjs` serves the site on port 4173. `node --test tests/*.test.mjs` runs scoring/state regressions.

## Prior issue

The original 0–4 scale validly produced six zero scores for all-low responses; mixed-answer UI replay did not reproduce a collapse to zeros. Equal results had no route to resolve a primary role. Regression coverage distinguishes actual score corruption from that unresolved tie case. The new UI uses explicit 1–5 labels and a preference confirmation flow.

## September 13 UI follow-up
Active entry points are app-v4.mjs and styles-v4.css, with a visible footer build label. The owner's screenshot still had old v2 copy despite v3 files being served, so v4 uses new entry URLs and an explicit preview navigation. It does not assume a hot reload occurred. Fixed top interests are now non-interactive summaries; one remaining interest uses radio inputs, all-flat ties use two checkboxes. A single inline SVG is centered inside each choice circle.
Both versions share the career panel immediately below the role. Eighteen sourced occupational salary snapshots produce six numeric cards per role, alongside the 17 existing exploration directions. Each snapshot stores its source URL, cutoff date, sample count and concentration-band share; none is presented as a mean, take-home pay or multi-year trend. No recruitment search links remain. Full browser checks: node tests/ui-v4.cjs (bundled Playwright plus installed Chrome); covers both full answer flows, one/two-choice ties, mark geometry, progress, results, refresh and three viewport widths.
