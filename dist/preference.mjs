export function normalizePreference(result,selected=[]){
 return [...result.fixedCodes,...new Set(selected.filter(c=>result.tieCodes.includes(c)))].slice(0,2);
}
export function preferenceProgress(result,selected){
 const remaining=2-normalizePreference(result,selected).length;
 return remaining?`${result.fixedCodes.length?`已自动保留 ${result.fixedCodes.length} 个最高分方向；`:''}还需选择 ${remaining} 个方向`:'已确认 2 个方向，可以查看角色';
}
