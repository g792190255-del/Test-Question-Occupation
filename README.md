# 兴趣坐标

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
