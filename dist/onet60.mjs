// All 60 activities in the O*NET Interest Profiler Short Form paper instrument.
// Source: https://www.onetcenter.org/dl_tools/ipsf/Interest_Profiler.pdf
// Chinese translations and the five-point presentation are a private evaluation adaptation.
// See sources.html for attribution, modifications, and validation status.
const groups = {
 R:[
 ['Build kitchen cabinets','制作厨房橱柜'],['Lay brick or tile','砌砖或铺设瓷砖'],['Repair household appliances','维修家用电器'],['Raise fish in a fish hatchery','在鱼苗孵化场养鱼'],['Assemble electronic parts','组装电子零件'],['Drive a truck to deliver packages to offices and homes','驾驶卡车向办公室和住户配送包裹'],['Test the quality of parts before shipment','在发货前检测零件质量'],['Repair and install locks','维修和安装门锁'],['Set up and operate machines to make products','设置并操作机器来制造产品'],['Put out forest fires','扑灭森林火灾']],
 I:[
 ['Develop a new medicine','研发一种新药'],['Study ways to reduce water pollution','研究减少水污染的方法'],['Conduct chemical experiments','进行化学实验'],['Study the movement of planets','研究行星的运动'],['Examine blood samples using a microscope','使用显微镜检查血液样本'],['Investigate the cause of a fire','调查火灾发生的原因'],['Develop a way to better predict the weather','开发更准确预测天气的方法'],['Work in a biology lab','在生物实验室工作'],['Invent a replacement for sugar','发明一种糖的替代品'],['Do laboratory tests to identify diseases','进行实验室检测以识别疾病']],
 A:[
 ['Write books or plays','写书或创作戏剧'],['Play a musical instrument','演奏一种乐器'],['Compose or arrange music','作曲或编曲'],['Draw pictures','绘画'],['Create special effects for movies','为电影制作特效'],['Paint sets for plays','为戏剧绘制舞台布景'],['Write scripts for movies or television shows','为电影或电视节目编写剧本'],['Perform jazz or tap dance','表演爵士舞或踢踏舞'],['Sing in a band','在乐队中演唱'],['Edit movies','剪辑电影']],
 S:[
 ['Teach an individual an exercise routine','指导一个人完成一套锻炼动作'],['Help people with personal or emotional problems','帮助有个人困扰或情绪问题的人'],['Give career guidance to people','为他人提供职业指导'],['Perform rehabilitation therapy','开展康复治疗'],['Do volunteer work at a non-profit organization','在非营利组织做志愿服务'],['Teach children how to play sports','教孩子参加体育运动'],['Teach sign language to people who are deaf or hard of hearing','教失聪或听力有障碍的人使用手语'],['Help conduct a group therapy session','协助开展团体治疗活动'],['Take care of children at a day-care center','在日托中心照顾儿童'],['Teach a high-school class','给高中班级授课']],
 E:[
 ['Buy and sell stocks and bonds','买卖股票和债券'],['Manage a retail store','管理一家零售店'],['Operate a beauty salon or barber shop','经营美容院或理发店'],['Manage a department within a large company','管理大型公司中的一个部门'],['Start your own business','创办自己的企业'],['Negotiate business contracts','洽谈商业合同'],['Represent a client in a lawsuit','在诉讼中代理客户'],['Market a new line of clothing','推广一个新的服装系列'],['Sell merchandise at a department store','在百货商店销售商品'],['Manage a clothing store','管理一家服装店']],
 C:[
 ['Develop a spreadsheet using computer software','使用计算机软件制作电子表格'],['Proofread records or forms','校对记录或表格'],['Install software across computers on a large network','在大型网络中的多台计算机上安装软件'],['Operate a calculator','操作计算器'],['Keep shipping and receiving records','维护收发货记录'],['Calculate the wages of employees','计算员工工资'],['Inventory supplies using a hand-held computer','使用手持电脑盘点物资'],['Record rent payments','记录租金支付情况'],['Keep inventory records','维护库存记录'],['Stamp, sort, and distribute mail for an organization','为机构的邮件盖章、分类并分发']]
};
export const onet60=Object.entries(groups).flatMap(([type,items])=>items.map(([en,text],i)=>({id:`onet-${type}-${i+1}`,type,text,en})));
