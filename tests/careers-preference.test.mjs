import test from 'node:test';
import assert from 'node:assert/strict';
import {calculate,versions,roles} from '../dist/model.mjs';
import {normalizePreference,preferenceProgress} from '../dist/preference.mjs';
import {careerCatalog,careerMarkup} from '../dist/careers.mjs';
test('one fixed highest direction needs exactly one extra choice',()=>{
 const answers=versions.full.questions.map(q=>q.type==='E'?4:['I','S'].includes(q.type)?3:2);
 const r=calculate(answers,'full');
 let selection=normalizePreference(r,[]);
 assert.deepEqual(selection,['E']);assert.match(preferenceProgress(r,selection),/还需选择 1/);
 selection=normalizePreference(r,[...selection,'I']);
 assert.deepEqual(selection,['E','I']);assert.equal(calculate(answers,'full',selection).primary.code,'IE');
 assert.match(preferenceProgress(r,selection),/可以查看角色/);
 assert.deepEqual(normalizePreference(r,['R','A']),['E']);
 assert.deepEqual(normalizePreference(r,['I','I']),['E','I']);
});
test('flat answers need two choices, then preserve scores',()=>{
 const answers=Array(18).fill(3),r=calculate(answers);
 assert.match(preferenceProgress(r,[]),/还需选择 2/);
 assert.match(preferenceProgress(r,['I']),/还需选择 1/);
 assert.deepEqual(calculate(answers,'brief',['I','A']).scores,r.scores);
});
test('all fifteen roles have distinct occupational groups and honest salary limitations',()=>{
 for(const role of roles){const groups=careerCatalog[role.code];assert.equal(groups.length,4);
 const jobs=groups.flatMap(g=>g.jobs);assert.equal(jobs.length,17);assert.equal(new Set(jobs).size,17);
 const html=careerMarkup(role.code);assert.match(html.replace(/<[^>]*>/g,''),/这个结果仅供参考/);assert.match(html.replace(/<[^>]*>/g,''),/这些数据来源于职业求职软件，仅供参考/);
 assert.equal((html.match(/class="salary-card"/g)||[]).length,6);assert.doesNotMatch(html,/BOSS|zhipin|查岗位与薪资/);
 }
});

import {salaryRecords,salariesForRole} from '../dist/salaries.mjs';
test('salary snapshots are sourced, scoped and available for every role',()=>{assert.equal(salaryRecords.length,18);for(const row of salaryRecords){assert(row.low>0&&row.high>row.low);assert(row.share>0&&row.share<=100);assert(row.samples>0);assert.match(row.asOf,/^2026-\d{2}-\d{2}$/);assert.match(row.url,/^https:\/\/www\.jobui\.com\/salary\//);}for(const role of roles)assert.equal(salariesForRole(role.code).length,6);});
