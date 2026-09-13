import {supabaseConfig} from './supabase-config.mjs?v=6';
import {createRepository,createSaveQueue,prepareRecord,participantId} from './report-records.mjs';
const repository=createRepository(supabaseConfig),queue=createSaveQueue(repository);
const person=participantId();
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function mountReportSaving(session,persist){
 const host=document.querySelector('#report-save');if(!host)return;
 let payload,revision;
 const update=(message,retry=false)=>{if(!host.isConnected)return;host.replaceChildren();const label=document.createElement('span');label.textContent=message;host.append(label);if(retry){const button=document.createElement('button');button.className='text-button';button.textContent='重试保存';button.onclick=save;host.append(button);}};
 async function save(){
  update('报告已生成，正在保存记录…');
  try{
   payload=prepareRecord(session,person);revision=JSON.stringify(payload);persist();
   if(session.cloudRecord.savedRevision!==revision){await queue(payload);if(session.cloudRecord?.id===payload.run_id){session.cloudRecord.savedRevision=revision;persist();}}
   update('测试结果已保存');
  }catch{update('结果展示成功，但保存记录失败，请稍后再试。',true);}
 }
 // Yield a paint: a slow network must never delay seeing the report.
 requestAnimationFrame(()=>setTimeout(()=>{if(host.isConnected)save();},0));
}
export function statisticsMarkup(){
 return `<section class="statistics-shell"><div class="result-top"><span class="eyebrow">INTEREST ATLAS · 数据观察</span><a class="text-button" href="#home">返回首页 ↗</a></div><h1 tabindex="-1">每一种兴趣，都被看见。</h1><p class="page-description">看看大家的探索方向，发现角色的分布。</p><div class="statistics-controls"><label>问卷范围 <select id="stats-version"><option value="all">全部版本</option><option value="brief">简约版 · 20 题</option><option value="full">完整版 · 60 题</option></select></label><button class="secondary-button" id="stats-refresh">刷新数据 ↻</button></div><div id="statistics-data" aria-live="polite"></div><p class="fine-print">“参与人数”按匿名浏览器标识估算，同一浏览器多次测试只计 1 人；清除浏览器数据或换设备可能重复计数。角色人数与分布采用每人在所选范围内最近保存的一份报告。测试次数包含重复测试。百分比经四舍五入，合计可能略有误差。</p><p class="fine-print">这里只展示汇总数据，不展示任何人的答案。样本来自本站使用者，不代表社会人群比例。</p></section>`;
}
export function mountStatistics(){
 const host=document.querySelector('#statistics-data'),select=document.querySelector('#stats-version'),refresh=document.querySelector('#stats-refresh');let request=0;
 async function load(){const token=++request;host.innerHTML='<p class="stats-message">正在读取统计…</p>';refresh.disabled=true;
  try{const data=await repository.stats(select.value);if(token!==request||!host.isConnected)return;
   const rows=data.roles.map(r=>{const value=Math.max(0,Math.min(100,Number(r.percentage)||0));return `<tr><th scope="row"><span>${escape(r.title)}</span><small>${escape(r.code)}</small></th><td>${Number(r.participants)}</td><td><div class="distribution-cell"><span class="distribution-track"><i style="width:${value}%"></i></span><strong>${value.toFixed(1)}%</strong></div></td><td>${Number(r.runs)}</td></tr>`;}).join('');
   host.innerHTML=`<div class="stats-totals"><div><span>参与人数（估算）</span><strong>${data.total_participants.toLocaleString()}</strong><small>匿名浏览器去重</small></div><div><span>累计测试次数</span><strong>${data.total_runs.toLocaleString()}</strong><small>已成功保存的报告</small></div></div>${data.total_runs===0?'<p class="stats-message">还没有已保存的测试记录。完成一次测试后，这里就会出现角色分布。</p>':''}<div class="distribution-panel"><h2>角色分布</h2><div class="distribution-scroll"><table class="distribution-table"><caption class="sr-only">各角色人数、占比及测试次数</caption><thead><tr><th scope="col">结果角色</th><th scope="col">人数</th><th scope="col">占比</th><th scope="col">测试次数</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
  }catch{if(token===request&&host.isConnected)host.innerHTML='<p class="stats-message">暂时无法读取统计，请稍后点击“刷新数据”重试。</p>';}
  finally{if(token===request&&host.isConnected)refresh.disabled=false;}
 }
 select.onchange=load;refresh.onclick=load;load();
}
