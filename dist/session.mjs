import {versions,calculate,types,evidence} from './model.mjs';
export const SESSION_KEY='interest-atlas-v2';
export function createSession(version){
 if(!versions[version])throw new Error('请选择有效版本。');
 return {schema:2,version,answers:Array(versions[version].interestCount).fill(null),step:0,skills:[],skillAnswered:false,evidenceIndex:null,preference:[],completed:false,profileStep:0};
}
export function recordAnswer(session,index,value){
 if(!Number.isInteger(index)||index<0||index>=session.answers.length||!Number.isInteger(value)||value<1||value>5)throw new Error('无效的题目或选项。');
 session.answers[index]=value;session.preference=[];session.completed=false;
}
export function restoreSession(raw){
 try{
  const s=typeof raw==='string'?JSON.parse(raw):raw;const v=versions[s?.version];
  if(!v||s.schema!==2||!Array.isArray(s.answers)||s.answers.length!==v.interestCount||Array.from(s.answers).some(x=>x!==null&&(!Number.isInteger(x)||x<1||x>5)))return null;
  if(!Number.isInteger(s.step)||s.step<0||s.step>=v.count||!Array.isArray(s.skills)||new Set(s.skills).size!==s.skills.length||s.skills.some(c=>!types.some(t=>t.code===c)))return null;
  if(typeof s.skillAnswered!=='boolean'||typeof s.completed!=='boolean'||!(s.evidenceIndex===null||Number.isInteger(s.evidenceIndex)&&s.evidenceIndex>=0&&s.evidenceIndex<evidence.length)||!Array.isArray(s.preference)||s.preference.length&&!s.answers.every(Number.isInteger))return null;
  if(s.preference.length)calculate(s.answers,s.version,s.preference);
  if(s.completed&&(!s.answers.every(Number.isInteger)||(s.version==='brief'&&(!s.skillAnswered||s.evidenceIndex===null))||!calculate(s.answers,s.version,s.preference).primary))return null;
  return {...createSession(s.version),...s,profileStep:s.profileStep===1?1:0};
 }catch{return null;}
}
