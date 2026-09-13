import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';import {roles} from '../dist/model.mjs';
test('each role uses a separate native high-resolution PNG',async()=>{
 const hashes=new Set();for(const role of roles){const bytes=await readFile(new URL(`../dist/assets/roles/${role.code}.png`,import.meta.url));assert.equal(bytes.toString('ascii',1,4),'PNG');assert.ok(bytes.readUInt32BE(16)>=1200,`${role.code} width too low`);assert.ok(bytes.readUInt32BE(20)>=1200,`${role.code} height too low`);hashes.add(createHash('sha256').update(bytes).digest('hex'));}assert.equal(hashes.size,15);
});
