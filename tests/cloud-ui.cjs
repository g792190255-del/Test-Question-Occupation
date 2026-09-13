const {chromium}=require('C:/Users/SJ/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const {versions}=await import('../dist/model.mjs');const {createSession,SESSION_KEY}=await import('../dist/session.mjs');
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});const ids=[];
 try{for(const version of ['brief','full']){
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  let calls=0;await page.route('**/rpc/save_holland_result',async route=>{const p=route.request().postDataJSON().payload;ids.push(p.run_id);fs.writeFileSync('output/live-test-ids.json',JSON.stringify([...new Set(ids)]));calls++;if(version==='brief'&&calls===1)return route.fulfill({status:503,body:'{}',contentType:'application/json'});if(version==='full')await new Promise(r=>setTimeout(r,1500));return route.continue();});
  await page.goto('http://127.0.0.1:4173/?build=6');const s=createSession(version);s.answers=versions[version].questions.map(q=>'IE'.includes(q.type)?5:2);s.completed=true;s.skillAnswered=true;s.skills=['I'];s.evidenceIndex=0;
  await page.evaluate(({s,key})=>{sessionStorage.setItem(key,JSON.stringify(s));},{s,key:SESSION_KEY});await page.goto('http://127.0.0.1:4173/?build=6-test#result');
  await page.locator('.result-hero h1').waitFor();assert.match(await page.locator('.result-hero h1').textContent(),/策略探索家/);
  if(version==='brief'){await page.getByText('结果展示成功，但保存记录失败，请稍后再试。',{exact:true}).waitFor();assert.equal(await page.locator('.salary-card').count(),6);await page.getByRole('button',{name:'重试保存'}).click();}
  else {assert(!/已保存/.test(await page.locator('#report-save').textContent()));}
  await page.getByText('测试结果已保存',{exact:true}).waitFor({timeout:20000});const callsBefore=calls;
  await page.reload();await page.getByText('测试结果已保存',{exact:true}).waitFor();assert.equal(calls,callsBefore);
  assert.equal(await page.locator('.report-keywords span').count(),3);
  await page.locator('.statistics-link').click();await page.locator('.stats-totals').waitFor();assert.equal(await page.locator('.distribution-table tbody tr').count(),15);
  await page.locator('#stats-version').selectOption(version);await page.locator('.stats-totals').waitFor();assert(Number(await page.locator('.stats-totals strong').first().textContent())>=1);
  for(const width of [320,390,1100]){await page.setViewportSize({width,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:`output/${version}-statistics-v6.png`,fullPage:true});assert.deepEqual(errors,[]);await page.close();
 }console.log('Live brief/full persistence, failure/retry, slow save, refresh deduplication, stats and mobile layout passed.');}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});


