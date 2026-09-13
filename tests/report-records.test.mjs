import test from 'node:test';
import assert from 'node:assert/strict';
import {createSession} from '../dist/session.mjs';
import {versions} from '../dist/model.mjs';
import {prepareRecord,createRepository,createSaveQueue,isConfigured,participantId} from '../dist/report-records.mjs';
const person=crypto.randomUUID();
function report(version='brief'){const s=createSession(version);s.answers=versions[version].questions.map(q=>'IE'.includes(q.type)?5:2);s.completed=true;s.skillAnswered=true;s.evidenceIndex=0;return s;}
for(const version of ['brief','full'])test(version+' keeps report identity across refresh and profile edits',()=>{
 const s=report(version),p=prepareRecord(s,person);const restored=JSON.parse(JSON.stringify(s));restored.skills=['I'];const edited=prepareRecord(restored,person);assert.equal(p.run_id,edited.run_id);assert.equal(p.completed_at,edited.completed_at);assert.equal(p.role_code,'IE');assert.equal(p.answers.interest.length,versions[version].interestCount);
 restored.answers=restored.answers.map((v,i)=>i===0?1:v);assert.notEqual(prepareRecord(restored,person).run_id,p.run_id);
});
test('incomplete reports cannot be submitted',()=>assert.throws(()=>prepareRecord(createSession('brief'),person)));
test('blocked storage does not stop reports',()=>assert.match(participantId({getItem(){throw Error()},setItem(){throw Error()}}),/^[0-9a-f-]{36}$/));
test('secret keys never qualify as public configuration',()=>{assert.equal(isConfigured({url:'https://example.supabase.co',publishableKey:'sb_secret_example'}),false);assert.equal(isConfigured({url:'https://example.supabase.co',publishableKey:'x.'+btoa(JSON.stringify({role:'service_role'}))+'.x'}),false);});
test('background queue deduplicates and orders updates',async()=>{
 const received=[];let release;const first=new Promise(r=>release=r);const save=createSaveQueue({async save(p){received.push(p.skills);if(received.length===1)await first;return {saved:true};}});
 const a=save({run_id:'same',skills:1}),b=save({run_id:'same',skills:1}),c=save({run_id:'same',skills:2});await new Promise(r=>setTimeout(r,0));assert.deepEqual(received,[1]);release();await Promise.all([a,b,c]);assert.deepEqual(received,[1,2]);
});
test('failure can retry with identical id; publishable key uses apikey header',async()=>{
 let calls=0;const payload=prepareRecord(report(),person);const config={url:'https://example.supabase.co',publishableKey:'sb_publishable_testpublic12345'};
 const repo=createRepository(config,async(url,req)=>{assert.equal(req.headers.Authorization,undefined);assert.equal(JSON.parse(req.body).payload.run_id,payload.run_id);return ++calls===1?{ok:false}:{ok:true,json:async()=>({saved:true,run_id:payload.run_id})};});
 const save=createSaveQueue(repo);await assert.rejects(save(payload));assert.equal((await save(payload)).saved,true);assert.equal(calls,2);
});
test('request timeout rejects without modifying report',async()=>{const payload=prepareRecord(report(),person),before=JSON.stringify(payload);const repo=createRepository({url:'https://example.supabase.co',publishableKey:'sb_publishable_testpublic12345'},(url,req)=>new Promise((resolve,reject)=>req.signal.addEventListener('abort',()=>reject(Error('timeout')))),5);await assert.rejects(repo.save(payload));assert.equal(JSON.stringify(payload),before);});
