// Public recruitment sample snapshots verified 2026-09-13; units: thousand CNY/month.
// These are the source's reported concentration bands, not averages or individual offers.
export const salaryRecords=[
  {
    "type": "R",
    "name": "机械研发工程师",
    "low": 10,
    "high": 20,
    "share": 51.4,
    "samples": 3101,
    "asOf": "2026-09-05",
    "url": "https://www.jobui.com/salary/quanguo-jixieyanfagongchengshi/"
  },
  {
    "type": "R",
    "name": "自动化工程师",
    "low": 8,
    "high": 15,
    "share": 57.1,
    "samples": 15010,
    "asOf": "2026-08-19",
    "url": "https://www.jobui.com/salary/quanguo-zidonghuagongchengshi/"
  },
  {
    "type": "R",
    "name": "硬件工程师",
    "low": 20,
    "high": 50,
    "share": 47.5,
    "samples": 51340,
    "asOf": "2026-09-12",
    "url": "https://www.jobui.com/salary/quanguo-yingjiangongchengshi/"
  },
  {
    "type": "I",
    "name": "数据分析师",
    "low": 10,
    "high": 30,
    "share": 52.1,
    "samples": 15249,
    "asOf": "2026-09-11",
    "url": "https://www.jobui.com/salary/quanguo-shujufenxishi/"
  },
  {
    "type": "I",
    "name": "算法工程师",
    "low": 20,
    "high": 50,
    "share": 70,
    "samples": 80812,
    "asOf": "2026-09-13",
    "url": "https://www.jobui.com/salary/quanguo-suanfagongchengshi/"
  },
  {
    "type": "I",
    "name": "用户研究员",
    "low": 20,
    "high": 50,
    "share": 44.2,
    "samples": 351,
    "asOf": "2026-09-02",
    "url": "https://www.jobui.com/salary/quanguo-yonghuyanjiuyuan/"
  },
  {
    "type": "A",
    "name": "平面设计师",
    "low": 4.5,
    "high": 8,
    "share": 52.8,
    "samples": 30981,
    "asOf": "2026-09-11",
    "url": "https://www.jobui.com/salary/quanguo-pingmianshejishi/"
  },
  {
    "type": "A",
    "name": "UI设计师",
    "low": 8,
    "high": 15,
    "share": 40.1,
    "samples": 11260,
    "asOf": "2026-09-13",
    "url": "https://www.jobui.com/salary/quanguo-uishejishi/"
  },
  {
    "type": "A",
    "name": "视频剪辑师",
    "low": 4.5,
    "high": 8,
    "share": 61,
    "samples": 8536,
    "asOf": "2026-08-30",
    "url": "https://www.jobui.com/salary/quanguo-shipinjianjishi/"
  },
  {
    "type": "S",
    "name": "护士",
    "low": 2,
    "high": 4.5,
    "share": 67.7,
    "samples": 157269,
    "asOf": "2026-09-06",
    "url": "https://www.jobui.com/salary/quanguo-hushi/"
  },
  {
    "type": "S",
    "name": "康复治疗师",
    "low": 3,
    "high": 6,
    "share": 58.9,
    "samples": 10902,
    "asOf": "2026-08-18",
    "url": "https://www.jobui.com/salary/quanguo-kangfuzhiliaoshi/"
  },
  {
    "type": "S",
    "name": "美术教师",
    "low": 4.5,
    "high": 8,
    "share": 51.5,
    "samples": 5158,
    "asOf": "2026-07-10",
    "url": "https://www.jobui.com/salary/quanguo-meishujiaoshi/"
  },
  {
    "type": "E",
    "name": "产品经理",
    "low": 20,
    "high": 50,
    "share": 55.1,
    "samples": 167222,
    "asOf": "2026-09-11",
    "url": "https://www.jobui.com/salary/quanguo-chanpinjingli/"
  },
  {
    "type": "E",
    "name": "销售工程师",
    "low": 8,
    "high": 15,
    "share": 58.2,
    "samples": 90644,
    "asOf": "2026-07-12",
    "url": "https://www.jobui.com/salary/quanguo-xiaoshougongchengshi/"
  },
  {
    "type": "E",
    "name": "新媒体运营",
    "low": 4.5,
    "high": 8,
    "share": 52.5,
    "samples": 110052,
    "asOf": "2026-09-12",
    "url": "https://www.jobui.com/salary/quanguo-xinmeitiyunying/"
  },
  {
    "type": "C",
    "name": "行政专员",
    "low": 4.5,
    "high": 8,
    "share": 66,
    "samples": 67091,
    "asOf": "2026-08-17",
    "url": "https://www.jobui.com/salary/quanguo-xingzhengzhuanyuan/"
  },
  {
    "type": "C",
    "name": "人力资源专员 HR",
    "low": 6,
    "high": 10,
    "share": 63,
    "samples": 119,
    "asOf": "2026-08-14",
    "url": "https://www.jobui.com/salary/quanguo-renliziyuanzhuanyuanhr/"
  },
  {
    "type": "C",
    "name": "采购专员",
    "low": 4.5,
    "high": 8,
    "share": 61.8,
    "samples": 50250,
    "asOf": "2026-09-10",
    "url": "https://www.jobui.com/salary/quanguo-caigouzhuanyuan/"
  }
];
export function salariesForRole(code){return salaryRecords.filter(row=>code.includes(row.type));}
