const {chromium}=require('C:/Users/SJ/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
(async()=>{
 const {versions}=await import('../dist/model.mjs');
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
  for(const version of ['brief','full']){
   const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:4173/?build=4');await page.locator('#choose').click();
   await page.locator(`input[name=version][value=${version}]`).check({force:true});await page.locator('#begin').click();
   const config=versions[version];
   for(let i=0;i<config.interestCount;i++){
    const type=config.questions[i].type,value=version==='full'?3:type==='I'?5:['R','E'].includes(type)?4:2;
    await page.locator(`input[name=rating][value="${value}"]`).check({force:true});
    assert.match(await page.locator('#progress-label').textContent(),new RegExp(`已完成 ${i+1} / ${config.count}`));
    if(i===0){await page.screenshot({path:`output/${version}-progress-v4.png`});}
    await page.locator('#next').click();
   }
   if(version==='brief'){await page.locator('input[name=none]').check({force:true});await page.locator('#next').click();await page.locator('input[name=evidence][value="0"]').check({force:true});await page.locator('#next').click();}
   await page.waitForURL('**#confirm');
   const options=page.locator('input[name=preference]');
   if(version==='brief'){
    assert.equal(await options.count(),2);assert.equal(await options.first().getAttribute('type'),'radio');
    assert.match(await page.locator('.fixed-direction').textContent(),/研究型/);
    await options.first().check({force:true});assert.equal(await page.locator('#confirm-role').isEnabled(),true);
    await options.last().check({force:true});assert.equal(await page.locator('input[name=preference]:checked').count(),1);
   }else{
    assert.equal(await options.count(),6);await options.nth(0).check({force:true});assert.equal(await page.locator('#confirm-role').isDisabled(),true);
    await options.nth(1).check({force:true});assert.equal(await page.locator('#confirm-role').isEnabled(),true);
   }
   const geometry=await page.locator('.preference-card:has(input:checked)').first().evaluate(card=>{
    const mark=card.querySelector('.choice-circle'),svg=mark.querySelector('svg');const a=card.getBoundingClientRect(),b=mark.getBoundingClientRect(),c=svg.getBoundingClientRect();
    return{inside:c.left>=b.left&&c.right<=b.right&&c.top>=b.top&&c.bottom<=b.bottom,nearTop:b.top-a.top<30,visible:getComputedStyle(svg).visibility};
   });assert.deepEqual(geometry,{inside:true,nearTop:true,visible:'visible'});
   await page.screenshot({path:`output/${version}-confirm-v4.png`,fullPage:true});
   await page.locator('#confirm-role').click();await page.waitForURL('**#result');
   assert.equal(await page.locator('.salary-card').count(),6);assert.equal(await page.locator('.career-group li').count(),17);
   assert.match(await page.locator('#careers').textContent(),/这些数据来源于职业求职软件，仅供参考/);
   assert.equal(await page.locator('a[href*="zhipin"]').count(),0);
   assert.equal(await page.locator('.salary-value').count(),6);
   assert(await page.locator('#careers').evaluate(el=>el.offsetTop<document.querySelector('.result-columns').offsetTop));
   await page.locator('#careers').scrollIntoViewIfNeeded();await page.screenshot({path:`output/${version}-careers-v4.png`,fullPage:true});
   for(const width of [320,390,1100]){await page.setViewportSize({width,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
   await page.reload();assert.equal(await page.locator('.salary-card').count(),6);assert.deepEqual(errors,[]);
   console.log(`${version}: full UI flow, selection, check geometry, salaries, progress, reload and 320/390/1100px passed`);
   await page.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
