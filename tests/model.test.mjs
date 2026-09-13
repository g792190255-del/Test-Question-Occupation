import test from 'node:test';
import assert from 'node:assert/strict';
import {calculate,questions,roles,types} from '../dist/model.mjs';

test('all 15 roles are reachable and ordering within a pair does not change the role',()=>{
 for(const role of roles){
  for(const first of role.code){
   const answers=questions.map(q=>q.type===first?4:role.code.includes(q.type)?3:0);
   const r=calculate(answers);
   assert.deepEqual(r.possible.map(x=>x.code),[role.code]);
   assert.equal(r.scores[first],12);
  }
 }
});
test('neutral and all-negative responses do not fabricate a single winning role',()=>{
 for(const value of [0,2,4]){const r=calculate(Array(18).fill(value));assert.equal(r.flat,true);assert.equal(r.possible.length,15);assert.ok(r.ranked.every(x=>x.score===value*3));}
});
test('a second-place tie retains every eligible pair but excludes lower interests',()=>{
 const r=calculate(questions.map(q=>q.type==='A'?4:['I','S'].includes(q.type)?3:1));
 assert.deepEqual(r.possible.map(x=>x.code),['IA','AS']);
});
test('invalid or incomplete answers cannot produce a result',()=>{
 for(const answers of [[],Array(18).fill(null),Array(18).fill(5),Array(17).fill(3),Array(18).fill(1.2)])assert.throws(()=>calculate(answers));
});
test('every interest receives an equal number of questions',()=>{
 assert.equal(questions.length,18);for(const t of types)assert.equal(questions.filter(q=>q.type===t.code).length,3);
});
