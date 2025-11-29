// AI作画提示词生成器

interface PromptParams {
  petType: string;
  newIdentity: string;
  scenario: string;
  style: string;
}

// 根据身份生成服装和动作描述
function getIdentityDetails(identity: string): string {
  const identityMap: Record<string, string> = {
    '国际特工': '身穿定制黑色西装，戴着墨镜，表情严肃，手里拿着对讲机',
    '宇航员': '身穿白色宇航服，头戴透明头盔，手持探测设备',
    '摇滚明星': '身穿皮夹克和破洞牛仔裤，手持电吉他，戴着墨镜',
    '厨师': '身穿白色厨师服和高帽，手持锅铲，围着围裙',
    '超级英雄': '身穿紧身战斗服，披着披风，摆出英雄姿势',
    '海盗船长': '身穿海盗服装，戴着三角帽，手持望远镜',
    '武士': '身穿传统武士盔甲，手持武士刀，表情坚毅',
    '魔法师': '身穿长袍，戴着尖顶帽，手持魔杖，周围环绕魔法光芒',
    '赛车手': '身穿赛车服，戴着头盔，手持方向盘',
    '探险家': '身穿探险装备，戴着帽子，背着背包，手持地图',
  };

  return identityMap[identity] || `扮演${identity}的角色，穿着相应的服装`;
}

// 根据场景生成环境描述
function getScenarioDetails(scenario: string): string {
  const scenarioMap: Record<string, string> = {
    '雪山顶上秘密接头': '白雪皑皑的山顶，远处一架直升机螺旋桨正在旋转，雪花在风中飞舞，背景是连绵起伏的雪山和灰蒙蒙的天空，营造出紧张而神秘的氛围',
    '太空站执行任务': '未来科技感的太空站内部，透过舷窗可以看到璀璨的星空和地球，各种仪表盘闪烁着光芒，营造出科幻而壮观的氛围',
    '演唱会舞台中央': '灯光璀璨的演唱会舞台，台下人山人海，激光灯光交织，音响设备环绕，营造出热烈而激情的氛围',
    '米其林餐厅厨房': '高档餐厅的现代化厨房，不锈钢设备闪闪发光，各种食材整齐摆放，营造出专业而精致的氛围',
    '城市上空飞翔': '高楼林立的现代都市上空，夕阳余晖洒在建筑物上，云层在脚下飘过，营造出壮观而自由的氛围',
    '加勒比海航行': '碧蓝的加勒比海面，海浪翻滚，远处有小岛和宝藏，海鸥在空中盘旋，营造出冒险而浪漫的氛围',
    '古代战场': '硝烟弥漫的古代战场，旗帜飘扬，远处是城堡和军队，营造出史诗般的氛围',
    '魔法森林': '神秘的魔法森林，古树参天，魔法光点在空中飘浮，蘑菇和奇异植物遍布，营造出奇幻而神秘的氛围',
    '赛道上飞驰': '专业赛车赛道，两旁是观众席和广告牌，赛车呼啸而过，营造出速度与激情的氛围',
    '热带雨林探险': '茂密的热带雨林，藤蔓缠绕，瀑布飞流，各种奇异动植物，阳光透过树叶洒下斑驳光影，营造出神秘而原始的氛围',
  };

  return scenarioMap[scenario] || `在${scenario}的场景中，环境细节丰富`;
}

// 根据风格生成质量关键词
function getStyleKeywords(style: string): string {
  const styleMap: Record<string, string> = {
    '写实': '写实风格，超高清，8K，电影级照明，细节丰富，专业摄影',
    '卡通': '卡通风格，色彩鲜艳，线条流畅，可爱生动，高质量渲染',
    '油画': '油画风格，笔触细腻，色彩浓郁，艺术感强，大师级作品',
    '赛博朋克': '赛博朋克风格，霓虹灯光，未来科技感，暗黑氛围，高对比度',
    '水彩': '水彩风格，色彩柔和，渐变自然，艺术气息浓厚，清新淡雅',
    '像素艺术': '像素艺术风格，复古游戏感，色彩鲜明，细节精致',
    '素描': '素描风格，线条精准，明暗对比强烈，艺术感十足',
    '动漫': '日式动漫风格，人物精致，色彩明快，高质量作画',
  };

  return styleMap[style] || `${style}风格，高质量，细节丰富`;
}

// 生成完整的AI作画提示词
export function generatePrompt(params: PromptParams): string {
  const { petType, newIdentity, scenario, style } = params;

  const subject = `一只拟人化的${petType}`;
  const identityDetails = getIdentityDetails(newIdentity);
  const scenarioDetails = getScenarioDetails(scenario);
  const styleKeywords = getStyleKeywords(style);

  const prompt = `${styleKeywords}的照片。${subject}，${identityDetails}，站在${scenarioDetails}。`;

  return prompt;
}

// 预设的创意模板
export interface CreativeTemplate {
  id: string;
  name: string;
  petType: string;
  newIdentity: string;
  scenario: string;
  style: string;
  description: string;
}

export const creativeTemplates: CreativeTemplate[] = [
  {
    id: '1',
    name: '特工柴犬',
    petType: '柴犬',
    newIdentity: '国际特工',
    scenario: '雪山顶上秘密接头',
    style: '写实',
    description: '007风格的柴犬特工，在雪山执行秘密任务',
  },
  {
    id: '2',
    name: '宇航橘猫',
    petType: '橘猫',
    newIdentity: '宇航员',
    scenario: '太空站执行任务',
    style: '写实',
    description: '在太空站工作的橘猫宇航员',
  },
  {
    id: '3',
    name: '摇滚哈士奇',
    petType: '哈士奇',
    newIdentity: '摇滚明星',
    scenario: '演唱会舞台中央',
    style: '卡通',
    description: '在演唱会上表演的摇滚明星哈士奇',
  },
  {
    id: '4',
    name: '厨神金毛',
    petType: '金毛',
    newIdentity: '厨师',
    scenario: '米其林餐厅厨房',
    style: '写实',
    description: '在米其林餐厅掌勺的金毛大厨',
  },
  {
    id: '5',
    name: '超级英雄柯基',
    petType: '柯基',
    newIdentity: '超级英雄',
    scenario: '城市上空飞翔',
    style: '赛博朋克',
    description: '守护城市的柯基超级英雄',
  },
  {
    id: '6',
    name: '海盗船长英短',
    petType: '英国短毛猫',
    newIdentity: '海盗船长',
    scenario: '加勒比海航行',
    style: '油画',
    description: '在加勒比海冒险的英短海盗船长',
  },
];
