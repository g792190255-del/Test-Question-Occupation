import test from 'node:test';
import assert from 'node:assert/strict';
import {calculate,questions} from '../dist/model.mjs';

test('reported symptom: tied completed answers need a way to reach one primary role',()=>{
 const r=calculate(Array(18).fill(1));
 assert.ok(r.primary || r.needsPreference, 'Completed equal answers currently end with no primary role and no resolution step');
});
test('mixed real responses must not collapse to six zero scores',()=>{
 const r=calculate(questions.map(q=>q.type==='A'?5:q.type==='I'?4:2));
 assert.equal(r.scores.A,15);assert.equal(r.scores.I,12);
 assert.ok(Object.values(r.scores).every(s=>s>0));
});
