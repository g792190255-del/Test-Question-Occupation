import test from 'node:test';import assert from 'node:assert/strict';
import {calculate,versions,roles,types} from '../dist/model.mjs';
import {createSession,recordAnswer,restoreSession} from '../dist/session.mjs';
for(const version of ['brief','full']){
 const v=versions[version];
 test(`${version}: all 15 roles are reachable, highest-pair order independent`,()=>{
  for(const role of roles)for(const first of role.code){const r=calculate(v.questions.map(q=>q.type===first?5:role.code.includes(q.type)?4:1),version);assert.equal(r.primary.code,role.code);assert.equal(r.scores[first],v.perType*5);}
 });
 test(`${version}: equal answers require preference, then yield one role without altering scores`,()=>{
  for(const value of [1,3,5]){const a=Array(v.interestCount).fill(value);const r=calculate(a,version);assert.equal(r.needsPreference,true);assert.equal(r.possible.length,15);assert.ok(r.ranked.every(t=>t.average===value));for(const role of roles){const resolved=calculate(a,version,[...role.code]);assert.equal(resolved.primary.code,role.code);assert.deepEqual(resolved.scores,r.scores);}}
 });
 test(`${version}: second-place tie retains top interest and rejects low-scoring choices`,()=>{
  const a=v.questions.map(q=>q.type==='A'?5:['I','S'].includes(q.type)?4:1);const r=calculate(a,version);assert.deepEqual(r.fixedCodes,['A']);assert.deepEqual(r.possible.map(x=>x.code),['IA','AS']);assert.throws(()=>calculate(a,version,['R','C']));assert.throws(()=>calculate(a,version,['','A']));assert.equal(calculate(a,version,['A','S']).primary.code,'AS');
 });
 test(`${version}: missing, zero, out-of-range and sparse answers cannot become zero reports`,()=>{
  for(const a of [[],Array(v.interestCount).fill(null),Array(v.interestCount).fill(0),Array(v.interestCount).fill(6),Array(v.interestCount).fill(1.2),Array(v.interestCount)])assert.throws(()=>calculate(a,version));
 });
 test(`${version}: balanced domains and unique items`,()=>{assert.equal(v.questions.length,v.interestCount);assert.equal(new Set(v.questions.map(q=>q.text)).size,v.interestCount);for(const t of types)assert.equal(v.questions.filter(q=>q.type===t.code).length,v.perType);});
}
test('full instrument retains all 60 English activities and source IDs',()=>{assert.equal(new Set(versions.full.questions.map(q=>q.id)).size,60);assert.ok(versions.full.questions.every(q=>q.en));});
test('editing an answer changes that question only and survives refresh',()=>{const s=createSession('brief');recordAnswer(s,0,5);recordAnswer(s,1,2);recordAnswer(s,0,3);assert.deepEqual(s.answers.slice(0,3),[3,2,null]);assert.deepEqual(restoreSession(JSON.stringify(s)),s);});
test('corrupt or old session cannot silently show a zero report',()=>{const s=createSession('full');assert.equal(restoreSession('{broken'),null);assert.equal(restoreSession({...s,answers:Array(60).fill(0)}),null);assert.equal(restoreSession({...s,completed:true}),null);assert.equal(restoreSession({...s,step:99}),null);});
test('skills never alter recorded interest scores',()=>{const s=createSession('brief');s.answers=versions.brief.questions.map(q=>q.type==='R'?5:q.type==='I'?4:2);const before=calculate(s.answers);s.skills=['A','S'];s.evidenceIndex=0;assert.deepEqual(calculate(s.answers).scores,before.scores);});
