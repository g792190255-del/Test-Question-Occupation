import {calculate} from './model.mjs';
export const keywordCatalog={RI:['动手验证','原理探索','问题排查'],RA:['创意造物','审美表达','实践制作'],RS:['实际支持','细心照护','服务他人'],RE:['行动推动','资源协调','实践经营'],RC:['精确执行','标准流程','品质把关'],IA:['好奇探索','创意思考','知识表达'],IS:['理解他人','循证思考','成长支持'],IE:['策略分析','机会识别','目标推动'],IC:['逻辑分析','数据洞察','系统思考'],AS:['共情表达','故事创作','情感连接'],AE:['创意策划','传播影响','项目发起'],AC:['视觉表达','结构整理','细节打磨'],SE:['人际连接','团队协作','社群推动'],SC:['细致支持','流程协调','可靠服务'],EC:['目标管理','计划执行','资源统筹']};
const uuidPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function participantId(storage){
 const key='interest-atlas-participant';let id;try{storage??=globalThis.localStorage;id=storage.getItem(key);}catch{}
 if(!uuidPattern.test(id||'')){id=crypto.randomUUID();try{storage.setItem(key,id);}catch{}}
 return id;
}
export function prepareRecord(session,participant,now=new Date().toISOString()){
 if(!session.completed)throw Error('测试尚未完成');
 const result=calculate(session.answers,session.version,session.preference);if(!result.primary)throw Error('角色尚未确认');
 const signature=JSON.stringify([session.version,session.answers,result.primary.code]);
 if(session.cloudRecord?.signature!==signature||!uuidPattern.test(session.cloudRecord?.id||'')||!uuidPattern.test(session.cloudRecord?.writeKey||'')){
  session.cloudRecord={id:crypto.randomUUID(),writeKey:crypto.randomUUID(),completedAt:now,signature,participantId:participant};
 }
 const record=session.cloudRecord;
 return {run_id:record.id,write_key:record.writeKey,participant_id:record.participantId,version:session.version,instrument_version:'holland-2026-09-v1',role_code:result.primary.code,completed_at:record.completedAt,answers:{interest:[...session.answers],skills:[...session.skills],evidence_index:session.evidenceIndex},preference:[...session.preference]};
}
export function isConfigured(config){
 try{const url=new URL(config.url);if(url.protocol!=='https:')return false;}catch{return false;}
 const key=config.publishableKey;if(typeof key!=='string')return false;
 if(key.startsWith('sb_publishable_'))return key.length>20;
 try{return JSON.parse(atob(key.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).role==='anon';}catch{return false;}
}
export function createRepository(config,fetchImpl=globalThis.fetch,timeout=10000){
 const configured=isConfigured(config);
 async function rpc(name,args){
  if(!configured)throw new Error('DATABASE_NOT_CONFIGURED');
  const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),timeout);
  try{const headers={'Content-Type':'application/json',apikey:config.publishableKey};if(!config.publishableKey.startsWith('sb_publishable_'))headers.Authorization='Bearer '+config.publishableKey;
   const response=await fetchImpl(config.url.replace(/\/$/,'')+'/rest/v1/rpc/'+name,{method:'POST',headers,body:JSON.stringify(args),signal:abort.signal});
   if(!response.ok)throw new Error('DATABASE_REQUEST_FAILED');return await response.json();
  }finally{clearTimeout(timer);}
 }
 return {configured,async save(payload){const data=await rpc('save_holland_result',{payload});if(data?.run_id!==payload.run_id||data?.saved!==true)throw Error('INVALID_SAVE_RESPONSE');return data;},async stats(version='all'){const data=await rpc('holland_statistics',{selected_version:version});if(!data||!Array.isArray(data.roles)||!Number.isFinite(data.total_runs)||!Number.isFinite(data.total_participants))throw Error('INVALID_STATISTICS');return data;}};
}
export function createSaveQueue(repository){
 const running=new Map(),tails=new Map();
 return async function save(payload){const revision=JSON.stringify(payload);if(running.has(revision))return running.get(revision);const prior=tails.get(payload.run_id)||Promise.resolve();const task=prior.catch(()=>{}).then(()=>repository.save(payload));running.set(revision,task);tails.set(payload.run_id,task);try{return await task;}finally{running.delete(revision);if(tails.get(payload.run_id)===task)tails.delete(payload.run_id);}};
}
