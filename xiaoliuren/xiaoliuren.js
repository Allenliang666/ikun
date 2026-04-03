/**
 * 小六壬排盘核心算法 v3
 * 新增：纳音五行阴阳判断 + 十二神排布 + 主宰神标注
 */

// ============================================================
// 基础数据
// ============================================================
const TIANGAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const DIZHI   = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

// 天干阴阳
const GAN_YY = { '甲':'阳','丙':'阳','戊':'阳','庚':'阳','壬':'阳',
                  '乙':'阴','丁':'阴','己':'阴','辛':'阴','癸':'阴' };
// 地支阴阳
const ZHI_YY = { '子':'阳','寅':'阳','辰':'阳','午':'阳','申':'阳','戌':'阳',
                  '丑':'阴','卯':'阴','巳':'阴','未':'阴','酉':'阴','亥':'阴' };
// 天干五行
const GAN_WX = { '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土',
                  '己':'土','庚':'金','辛':'金','壬':'水','癸':'水' };
// 地支五行
const ZHI_WX = { '子':'水','丑':'土','寅':'木','卯':'木','辰':'土',
                  '巳':'火','午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水' };
const WX_CLS = { '木':'wood','火':'fire','土':'earth','金':'metal','水':'water' };
const WX_SHENG = { '木':'火','火':'土','土':'金','金':'水','水':'木' };
const WX_KE    = { '木':'土','火':'金','土':'水','金':'木','水':'火' };

// ── 六宫定义 ──
const GONG_DATA = [
  { idx:1, name:'大安', jixiong:'吉', jixiong_cls:'ji', color:'#50c878',
    desc:'身不动时，属木，为青龙，凡谋事主一、五、七',
    detail:{ general:'大安事事昌，求谋在东方，失物去不远，宅舍保安康，行人身未动，病者主无妨，将军回田野，仔细与推详',
      wealth:'财运平稳，守成有余，不宜冒进',career:'事业稳固，贵人相助，循序渐进',
      love:'感情和谐，缘分稳定，宜主动表达',health:'身体安康，注意休养，无大碍',
      travel:'出行平安，一路顺遂，吉利',lawsuit:'官司有利，可得贵人相助，宜和解' }
  },
  { idx:2, name:'留连', jixiong:'凶', jixiong_cls:'xiong', color:'#e05050',
    desc:'卒未归时，属水，为玄武，凡谋事主二、八、十',
    detail:{ general:'留连事难成，求谋曰未明，官事只宜缓，去者未回程，失物南方见，急讨方称心，更须防口舌，人口且平平',
      wealth:'财运迟滞，资金周转不畅，暂缓投资',career:'事业受阻，进展缓慢，需坚持等待',
      love:'感情纠缠，难以决断，宜冷静思考',health:'病情缠绵，恢复较慢，需耐心调养',
      travel:'出行多阻，行程延误，宜推迟',lawsuit:'官司拖延，难以速决，宜寻调解' }
  },
  { idx:3, name:'速喜', jixiong:'吉', jixiong_cls:'ji', color:'#50c878',
    desc:'人便至时，属火，为朱雀，凡谋事主三、六、九',
    detail:{ general:'速喜喜来临，求财向南行，失物申午未，逢人路上寻，官事有福德，病者无祸侵，田家六畜吉，行人有信音',
      wealth:'财运亨通，进财迅速，可大胆出手',career:'事业进展顺利，升迁有望，速行动',
      love:'感情升温，喜讯将至，宜主动出击',health:'病情好转迅速，康复在即',
      travel:'出行顺利，速去速回，吉利',lawsuit:'官司速决，结果有利，宜速行动' }
  },
  { idx:4, name:'赤口', jixiong:'凶', jixiong_cls:'xiong', color:'#e05050',
    desc:'官事凶时，属金，为白虎，凡谋事主四、七、十',
    detail:{ general:'赤口主口舌，官非切要防，失物急去寻，行人有惊慌，鸡犬多作怪，病者出西方，更须防咒诅，恐怕染蕴疾',
      wealth:'财运受损，防小人暗算，谨防诈骗',career:'职场是非多，慎防小人，低调行事',
      love:'感情口角频繁，宜冷静沟通',health:'注意口腔咽喉，防意外伤害',
      travel:'出行不利，易遇纠纷，宜推迟',lawsuit:'官司不利，口舌缠身，宜和解' }
  },
  { idx:5, name:'小吉', jixiong:'吉', jixiong_cls:'ji', color:'#50c878',
    desc:'人来喜时，属木，为六合，凡谋事主一、五、七',
    detail:{ general:'小吉最吉昌，路上好商良，阳人来报喜，失物在坤方，行人立便至，交关真是强，凡事皆和合，病者事无仿',
      wealth:'小财可得，积少成多，稳健理财',career:'事业小有进展，积累经验，厚积薄发',
      love:'感情渐好，小有进展，宜温柔以待',health:'身体渐好，注意调养',
      travel:'出行小吉，平安顺遂',lawsuit:'官司小胜，有利结果，宜坚持' }
  },
  { idx:6, name:'空亡', jixiong:'凶', jixiong_cls:'xiong', color:'#e05050',
    desc:'音信稀时，属土，为勾陈，凡谋事主一、五、七',
    detail:{ general:'空亡事不长，阴人小乘张，求财无有利，行人有灾殃，失物寻不见，官事主刑伤，病人逢暗鬼，乞解保安康',
      wealth:'财运落空，投资有损，暂缓行动',career:'事业受挫，努力难见成效，宜蓄势待发',
      love:'感情落空，缘分未到，宜放平心态',health:'病情反复，需积极就医',
      travel:'出行落空，计划有变，宜推迟',lawsuit:'官司落败，结果不利，宜和解' }
  },
];

// ── 六亲说明 ──
const LIUQIN_INFO = [
  { name:'妻财', color:'#c080e0', desc:'我克 → 妻、财、情缘' },
  { name:'官鬼', color:'#e05050', desc:'克我 → 夫、官、病、压力' },
  { name:'子孙', color:'#50c878', desc:'我生 → 子嗣、福气、喜悦' },
  { name:'父母', color:'#5090e0', desc:'生我 → 文书、长辈、贵人' },
  { name:'兄弟', color:'#c8a84b', desc:'同我 → 同辈、朋友、合作' },
];

// ── 十天干 → 主宰神 ──
// 甲→青龙 乙→六合 丙→朱雀 丁→螣蛇
// 戊己→勾陈/太常/天空/贵神（按地支分）
// 庚→白虎 辛→太阴 壬→玄武 癸→风后
const DAY_GAN_ZAIZAI = {
  '甲':'青龙','乙':'六合','丙':'朱雀','丁':'螣蛇',
  '戊':null,'己':null, // 特殊，看地支
  '庚':'白虎','辛':'太阴','壬':'玄武','癸':'风后'
};

// 戊日主宰神：子丑寅卯辰巳→勾陈，午未申酉戌亥→天空
const WU_ZAIZAI = {
  '子':'勾陈','丑':'勾陈','寅':'勾陈','卯':'勾陈','辰':'勾陈','巳':'勾陈',
  '午':'天空','未':'天空','申':'天空','酉':'天空','戌':'天空','亥':'天空'
};
// 己日主宰神：子寅辰午申戌→贵神，丑卯巳未酉亥→太常
const JI_ZAIZAI = {
  '子':'贵神','丑':'太常','寅':'贵神','卯':'太常','辰':'贵神','巳':'太常',
  '午':'贵神','未':'太常','申':'贵神','酉':'太常','戌':'贵神','亥':'太常'
};

// ── 纳音 → 十二神对（[阳神，阴神]） ──
// 金：阳→白虎，阴→太阴
// 木：阳→青龙，阴→六合
// 水：阳→玄武，阴→神后
// 火：阳→朱雀，阴→螣蛇
// 土：根据日干地支判断（戊己日→天空/贵神，其他→勾陈/太常）
const NAYIN_SHEN = {
  '金': ['白虎','太阴'],
  '木': ['青龙','六合'],
  '水': ['玄武','神后'],
  '火': ['朱雀','螣蛇'],
  '土': ['勾陈','太常'], // 土行纳音特殊，见下函数
};

// ── 六十甲子纳音（60个，每个纳音占两个连续序号） ──
const NAYIN_60 = [
  '海中金','海中金', // 0甲子, 1乙丑
  '炉中火','炉中火', // 2丙寅, 3丁卯
  '大林木','大林木', // 4戊辰, 5己巳
  '路旁土','路旁土', // 6庚午, 7辛未
  '剑锋金','剑锋金', // 8壬申, 9癸酉
  '山头火','山头火', // 10甲戌, 11乙亥
  '涧下水','涧下水', // 12丙子, 13丁丑
  '城头土','城头土', // 14戊寅, 15己卯
  '白蜡金','白蜡金', // 16庚辰, 17辛巳
  '杨柳木','杨柳木', // 18壬午, 19癸未
  '井泉水','井泉水', // 20甲申, 21乙酉
  '砂石金','砂石金', // 22丙戌, 23丁亥
  '山下火','山下火', // 24戊子, 25己丑
  '平地木','平地木', // 26庚寅, 27辛卯
  '壁上土','壁上土', // 28壬辰, 29癸巳
  '金箔金','金箔金', // 30甲午, 31乙未
  '覆灯火','覆灯火', // 32丙申, 33丁酉
  '天河水','天河水', // 34戊戌, 35己亥
  '大驿土','大驿土', // 36庚子, 37辛丑
  '钗钏金','钗钏金', // 38壬寅, 39癸卯
  '桑柘木','桑柘木', // 40甲辰, 41乙巳
  '大溪水','大溪水', // 42丙午, 43丁未
  '砂中土','砂中土', // 44戊申, 45己酉
  '石榴木','石榴木', // 46庚戌, 47辛亥
  '大海水','大海水', // 48壬子, 49癸丑
  '松柏木','松柏木', // 50甲寅, 51乙卯
  '长流水','长流水', // 52丙辰, 53丁巳
  '灯灯火','灯灯火', // 54戊午, 55己未
  '天河水','天河水', // 56庚申, 57辛酉
  '大海水','大海水', // 58壬戌, 59癸亥
];

// 计算六十甲子序号：甲子=0, 乙丑=1, 丙寅=2, 丁卯=3, 戊辰=4 ...
// 公式：seq = (地支序 + 6 * ((天干序 - 地支序 + 12) mod 12)) mod 60
function ganzhiSeq(gan, zhi) {
  const gIdx = TIANGAN.indexOf(gan);
  const zIdx = DIZHI.indexOf(zhi);
  return (zIdx + 6 * ((gIdx - zIdx + 12) % 12)) % 60;
}

// 根据干支获取纳音信息
function getNayinInfo(gan, zhi) {
  const seq = ganzhiSeq(gan, zhi);
  const name = NAYIN_60[seq] || '未知';
  // 判断阴阳：甲子序为偶数→阳，乙丑序为奇数→阴
  // 即：甲子(0), 丙寅(2), ... 壬申(8) 等偶数序为阳干支
  // 乙丑(1), 丁卯(3), ... 癸酉(9) 等奇数序为阴干支
  const isYang = seq % 2 === 0;
  return { name, seq, isYang };
}

function getNayinWx(nayin) {
  if (nayin.includes('金')) return '金';
  if (nayin.includes('火')) return '火';
  if (nayin.includes('木')) return '木';
  if (nayin.includes('水')) return '水';
  if (nayin.includes('土')) return '土';
  return '';
}

// ── 获取某干支的十二神 ──
// 注意：戊己日的主宰神特殊规则（按地支分）仅适用于主宰神，不适用于纳音十二神
// 纳音十二神统一规则：
//   金：阳→白虎，阴→太阴
//   木：阳→青龙，阴→六合
//   水：阳→玄武，阴→神后
//   火：阳→朱雀，阴→螣蛇
//   土：阳→勾陈，阴→太常（戊己纳音土亦用此规则）
function getShichen(gan, zhi, dayGan, dayZhi) {
  // 根据纳音五行阴阳
  const { name: nayin, isYang } = getNayinInfo(gan, zhi);
  const wx = getNayinWx(nayin);

  // 土行纳音统一用勾陈/太常
  if (wx === '土') {
    return isYang ? '勾陈' : '太常';
  }

  const pair = NAYIN_SHEN[wx] || ['未知','未知'];
  return isYang ? pair[0] : pair[1];
}

// ── 主宰神 ──
function getZaizaiShen(dayGan, dayZhi) {
  if (dayGan === '戊') return WU_ZAIZAI[dayZhi];
  if (dayGan === '己') return JI_ZAIZAI[dayZhi];
  return DAY_GAN_ZAIZAI[dayGan];
}

// ── 十二神颜色 ──
const SHEN_COLORS = {
  '青龙':'#50c878','白虎':'#a0c0e0','朱雀':'#e05050','螣蛇':'#c080e0',
  '勾陈':'#c8a84b','太常':'#e0c080','天空':'#a0a0b0','贵神':'#f0d080',
  '玄武':'#5090e0','神后':'#80c0f0','六合':'#80e0a0'
};

// 六亲详细解释库
const LIUQIN_DETAILS = {
  '父母': {
    title: '父母',
    people: '代表父母、长辈、老人、老师、师傅等能庇护、教导自己的人',
    things: '象征房屋、衣物、雨伞等庇护物品，以及书信、文书、契约、合同、成绩、信息、消息等与文星相关的事物，还包括车辆、飞机等交通工具',
    places: '学校、医院、交通局、道观、印刷厂、敬老院等与慈善、信仰、文化保护相关的场所',
    personality: '疲惫劳累、死板老成、成熟老练、有经验等',
    weather: '雨、雪、冰雹等天气现象'
  },
  '兄弟': {
    title: '兄弟',
    people: '代表兄弟姐妹、堂兄堂妹、表兄表妹、朋友、同事、师兄弟等同辈之人，以及同行竞争对手',
    things: '象征假肢、假牙、假发等替代品，以及破耗、劫财、花费等破财之事，还有阻拦、门槛等不顺之事',
    places: '体育馆、竞技场等具有竞争性质的场所',
    personality: '热情好客、自尊固执、做事莽撞、求财性急等',
    weather: '大风、逆风等天气现象'
  },
  '子孙': {
    title: '子孙',
    people: '代表儿女、孙子、孙女、幼儿、胎儿、晚辈、徒弟、下属等受自己庇护的人，以及医生、医药、僧侣、道士等克鬼的职业',
    things: '象征娱乐、开心、玩乐、消遣等高兴快乐的事物，以及六畜、六禽等动物',
    places: '医院、寺庙、游乐场、公园、动物园等与救死扶伤、娱乐相关的场所',
    personality: '好玩乐、活泼好动、会表达、会经营享受等',
    weather: '晴天、日月星辰等晴朗天气'
  },
  '妻财': {
    title: '妻财',
    people: '代表妻子、情人、女友、暧昧对象、相亲对象、女仆等受自己掌控和支配的人',
    things: '象征钱财、金银首饰、薪水、奖金、粮食、食物、酒水等饮食，以及私人用品、失物等',
    places: '饭店、酒店、食堂、居家厨房、仓库、银行等与饮食、财务相关的场所',
    personality: '性格重实际、不喜虚华、重视物质钱财与饮食等',
    weather: '晴朗多云天气'
  },
  '官鬼': {
    title: '官鬼',
    people: '代表官员、上司、老板、领导、长辈、男友、情郎等管束自己的人，以及盗贼、犯罪分子等不正当职业',
    things: '象征疾病、灾祸、疑惑、焦虑、担心、害怕等忧患之事，以及事业、官运、工作等',
    places: '公家、官府、司法部门、公安局、牢狱等与权力、法律相关的场所',
    personality: '有权势、雄心壮志、有责任感、恐惧疑虑、心怀鬼胎、狡猾、阴险歹毒等',
    weather: '雷电、黑云、浓雾等恶劣天气'
  }
};

// 地支详细解释库
const SHIZHI_DETAILS = {
  '子': {
    title: '子',
    concepts: '领袖、名人、英雄、思考、智慧、冥想、圆融、年轻女人、性、淫乱、胎儿、遮光的、装水的、小动物'
  },
  '丑': {
    title: '丑',
    concepts: '福德、正直、忠厚、贤惠、收获、看、吸引、暴露隐私、淫秽、肮脏、有缺陷的、诅咒、不和谐、突出'
  },
  '寅': {
    title: '寅',
    concepts: '欢乐、喜庆、祥和、奖励、婚姻、经济、文书、教育、发挥、艺术、表演、开始、变化、创意、化妆、木制品'
  },
  '卯': {
    title: '卯',
    concepts: '急速、快、流动、流浪、逃亡、摇摆、震动、盗窃、偷、偷看、文化、艺术、祥和、欢乐、柔术'
  },
  '辰': {
    title: '辰',
    concepts: '官司、词讼、牢狱、枪毙、自杀、死丧、仇恨、焦虑、惊恐、恐怖、困难、艰苦、凶恶、凶象、打斗、斗争、不屈、孕育'
  },
  '巳': {
    title: '巳',
    concepts: '炫丽多彩、光、光亮、玄光、变化、弯曲、摇摆、缠绕、花纹、网格、性感迷人、吸人眼球、魂牵梦绕、意乱情迷、狡诈、怪异、惊讶、惊恐、忧愁、诱惑、疑惑、思考、讨债、电子、信息、争斗、盯、祈索、乞丐、轻狂、流血'
  },
  '午': {
    title: '午',
    concepts: '光、光明、光亮、光彩、火光、佛光、华丽、亮丽、吸人眼球的、化妆、美容美发、漂亮、怀孕、胎孕、好色、网络、信息、疑惑、诚信'
  },
  '未': {
    title: '未',
    concepts: '味道、食品、酒食、亲呢、吻、收获、喜庆、婚庆、宴会、会见、拜神、否定'
  },
  '申': {
    title: '申',
    concepts: '动、传递、运输、运动、穿梭、伸展、舞动、打仗、战斗、交易、问题、阻碍、疾病、凶恶、玄妙、意识、境界、精神、神秘、时间、吃惊、裸体、好色、淫乱'
  },
  '酉': {
    title: '酉',
    concepts: '交易、金钱、金融、商务、密谋、策划、阴私、阴谋、暗中行事、诱惑、赌博、淫欲、精致、完美、咬'
  },
  '戌': {
    title: '戌',
    concepts: '虚幻、幻想、虚无飘渺、茫然、虚伪、虚假、伪装、欺诈、深邃、思考、宗教、境界、精神'
  },
  '亥': {
    title: '亥',
    concepts: '害怕、胆怯、疑惑、惊讶、危险、恐惧、炫丽、炫耀、眩晕、醉、色情、性崇拜、淫秽、隐私、偷情、偷盗、偷看、肮脏、沉溺、流动、湿、洗澡、光明、黑暗中的光、漂亮、祈祷，乞索、召见、欺诈、争斗、圆形的'
  }
};

// 十二神详细解释库
const SHEN_DETAILS = {
  '玄武': {
    title: '玄武(子)',
    concepts: '玄妙、虚幻、错觉、玄光、太极、深邃、通灵、幽灵、鬼魅、聪明多智、暧昧、偷情、怀孕、色欲、诱惑、春光泄露、好色、荡妇、忽悠、骗人、表演、绚丽多彩、晕、模糊、旋转、危险、涂抹、偷看、偷盗、黑暗、愤怒、哭泣、生活艰辛、乞讨、等待',
    geography: '大海、河流、洗手间、暗处、阴沟地井、探头煞、幽灵地带、寺庙、讲经场所、影院、弦月、悬空之地、墨水',
    animals: '黑色动物、乌鸦、黑狗、黑马、黑豹、黑熊、夜行动物、蝙蝠、偷盗的动物、老鼠、黄鼠狼、松鼠狡诈的动物、狐狸',
    plants: '漂亮、绚烂艳丽的植物、水生的植物、桃花、蟹爪兰、大理菊',
    objects: '水珠、液体、饮料、啤酒、酒类、洗漱品、淫秽物品、图片、地图、图画、文字、书法、照片、手印、电视、天梯、蛋',
    people: '哭泣的人、偷情者、邪淫的人、通灵者、巫师、钟馗、修道者、布道者、幽灵、鬼魂、笔仙、鬼魅忽悠的人、气功师、导演、演员、画家、作家、科学家、哲学家、脸色青白之人、目光呆滞之人、黑衣女、乞丐、孕妇、如厕的人'
  },
  '贵神': {
    title: '贵人(丑)',
    concepts: '荣华富贵、高档、高雅、领导、领袖、管理、有能力、利益、财富、帮助、慈善、公益、救护、解救、捐助、施舍、关爱、看护、调解、直觉、欢庆、婚庆、喜庆、祈祷',
    geography: '政府机构、办公楼、商场、高尚住宅区、剧院、艺术馆',
    animals: '高贵优雅的动物、马、天鹅、孔雀',
    plants: '兰花、牡丹、高贵花草',
    objects: '珠宝、金银器、证书、奖章、奢侈品',
    people: '领导、官员、慈善家、富人、帮助者'
  },
  '青龙': {
    title: '青龙(寅)',
    concepts: '富贵、高雅、名人、知名度、权威、指挥、成功、升迁、金融、钱币、文字、智慧、品牌、神秘、变化莫测、喜庆、婚姻、私通、暗中行事、两性、房事',
    geography: '银行、金融中心、写字楼、高级酒店',
    animals: '蛇、龙、有智慧的动物',
    plants: '智慧树、神秘植物',
    objects: '钱币、书籍、笔墨、电脑',
    people: '名人、权威人士、智者、神秘人物'
  },
  '六合': {
    title: '六合(卯)',
    concepts: '多、组合、合作、结合、团队、博弈、亲和力、默契、心心相通、和乐融融、乐善好施、亲密无间、亲呢、求爱、相融、爱护、理解、保护、欢乐、婚姻、亲吻、触觉、紧抱、依偎、求爱、交欢、怀孕、小孩、清纯的女孩',
    geography: '社交场所、聚会点、婚姻介绍所、学校',
    animals: '成群的动物、鸽子、情侣鸟',
    plants: '情侣植物、花草',
    objects: '爱心物品、情侣物品、儿童玩具',
    people: '恋人、团队伙伴、合作者、善良的人'
  },
  '勾陈': {
    title: '勾陈(辰)',
    concepts: '争斗、打斗、撕扯、勾心斗角、不忠心、博弈、赌博、犯法、官司、竞技、冷酷、残忍、凶恶、霸道、玩固、兵火、战争、争斗、勾引',
    geography: '法庭、竞技场、战场、赌博场所',
    animals: '凶猛的动物、狼、斗犬',
    plants: '荆棘、刺植物',
    objects: '武器、刑具、赌具',
    people: '对手、敌人、赌徒、冷酷的人'
  },
  '螣蛇': {
    title: '螣蛇(巳)',
    concepts: '五光十色、吸人眼球、光影、幻觉、幻化、梦境、迷惑、引诱、扰乱、干扰、网格状的、花纹、卷曲、弯曲、盘曲、捆绑、缠绕、上吊、拥抱、舔、颜色',
    geography: '娱乐场所、梦境般的地方、画廊',
    animals: '蛇、蝴蝶、变色龙',
    plants: '多彩植物、藤蔓',
    objects: '绳索、彩带、绘画',
    people: '演员、迷惑者、多变的人'
  },
  '朱雀': {
    title: '朱雀(午)',
    concepts: '声音、叫声、听觉、音乐、演奏、演艺、能说会道、吵架、文化、信息、文字、飞翔、跳跃、发动机、发射、活泼、活跃、轻的',
    geography: '音乐厅、传媒中心、学校',
    animals: '鸟、雀、唱歌的动物',
    plants: '轻盈的植物、草本',
    objects: '乐器、发声器、书籍',
    people: '歌手、演讲者、演员、活泼的人'
  },
  '太常': {
    title: '太常(未)',
    concepts: '富豪、富贵、财帛、婚姻、提亲、说媒、喜庆、酒食、吃、食品、文章、文书、印、武职、军衔、职位、家畜、生活用品',
    geography: '宴会场所、婚宴、财富聚集地',
    animals: '家畜、牛、羊',
    plants: '谷物、农作物',
    objects: '食物、印章、文书、生活用品',
    people: '富人、媒人、官员、宴请者'
  },
  '白虎': {
    title: '白虎(申)',
    concepts: '惊恐、凶猛、凶残、狠毒、恶斗、冷酷、灾难、阻隔、阻碍、恐吓、危险、破坏、伤痛、杀戮、流血、死亡、听觉、犯罪、战胜、白色、风骚、诱惑、车祸、虐待、枷锁、降服',
    geography: '危险地带、战场、刑场',
    animals: '白虎、猛兽、危险动物',
    plants: '有毒植物、荆棘',
    objects: '刑具、武器、危险物品',
    people: '罪犯、战士、危险人物'
  },
  '太阴': {
    title: '太阴(酉)',
    concepts: '提升、恩遇、喜庆、收获、赦免、创新、感觉、婚姻、怀孕、胎产、私通、幽会、隐私、淫乱、阴暗、阴谋、背光的、沉默、忧愁、冷淡、冷酷、欺诈、诅咒、冤仇、痛苦、哭泣、暗示、看不到的地方、另类',
    geography: '阴暗处、夜晚场所',
    animals: '夜行动物、蝙蝠',
    plants: '夜间开花的植物',
    objects: '隐私物品、暗器',
    people: '隐私者、阴谋者、忧郁者'
  },
  '天空': {
    title: '天空(戌)',
    concepts: '宽阔、宽松、敞开、劈开、蓬松、暴露、裸露、飞翔、幻象、幻影、梦幻、虚幻、虚无飘渺、中空、佛性、道性、空灵、悟性、境界、机关、感觉的到看不到的、空气、思念、回忆、追忆、往事、寂寞、孤独、单身、冷清、空车、空难、夸大、欺诈、窍、脱、跳高、坠落、电波、电磁',
    geography: '空阔地、云端、高空',
    animals: '鸟类、飞翔动物',
    plants: '藤蔓、飘摇植物',
    objects: '空气、云朵、幻象物品',
    people: '幻想者、孤独者、探险者'
  },
  '神后': {
    title: '神后(亥)',
    concepts: '成功女性、女皇、女中豪杰、怀孕、文静、贤淑、性、淫乱、暧味、阴私、第三者、拯救',
    geography: '女性场所、宫廷',
    animals: '雌性动物',
    plants: '女性化的植物',
    objects: '女性用品',
    people: '成功女性、女皇、孕妇'
  }
};
function shenColor(name) { return SHEN_COLORS[name] || '#ccc'; }

// ── 时辰地支 ──
function hourToZhi(hour) {
  return DIZHI[Math.floor(((hour + 1) % 24) / 2)];
}

// ── 干支推算（使用ikun天文历核心算法）──
function _getSxwnlGanzhi(year, month, day, hour) {
  try {
    const J2000 = 2451545, radd = Math.PI / 180;
    const a = Math.floor((14 - month) / 12);
    const yy = year + 4800 - a, mm = month + 12 * a - 3;
    const jd = (day + 0.5) + Math.floor((153*mm+2)/5) + 365*yy
      + Math.floor(yy/4) - Math.floor(yy/100) + Math.floor(yy/400) - 32045 - 0.5;
    const ob = {};
    obb.mingLiBaZi(jd - J2000, 120 * radd, ob);
    return {
      yn: ob.bz_jn || '', ym: ob.bz_jy || '', yd: ob.bz_jr || ''
    };
  } catch(e) { return null; }
}

function getYearGanzhi(year, month, day) {
  const gz = _getSxwnlGanzhi(year, month, day || 15, 12);
  if (gz && gz.yn.length === 2) return { gan: gz.yn[0], zhi: gz.yn[1] };
  const diff = ((year - 1984) % 60 + 60) % 60;
  return { gan: TIANGAN[diff % 10], zhi: DIZHI[diff % 12] };
}
function getMonthGanzhi(year, month, day) {
  const gz = _getSxwnlGanzhi(year, month, day || 15, 12);
  if (gz && gz.ym.length === 2) return { gan: gz.ym[0], zhi: gz.ym[1] };
  const zhiIdx = (month + 1) % 12;
  const yearGanIdx = TIANGAN.indexOf(getYearGanzhi(year).gan);
  const base = [2,4,6,8,0,2,4,6,8,0][yearGanIdx];
  return { gan: TIANGAN[(base + month - 1) % 10], zhi: DIZHI[zhiIdx] };
}
function getDayGanzhi(year, month, day) {
  const gz = _getSxwnlGanzhi(year, month, day, 12);
  if (gz && gz.yd.length === 2) return { gan: gz.yd[0], zhi: gz.yd[1] };
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd = day + Math.floor((153*m+2)/5) + 365*y
    + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045;
  const diff = ((jd - 2451545 + 40) % 60 + 60) % 60;
  return { gan: TIANGAN[diff % 10], zhi: DIZHI[diff % 12] };
}
function getHourGanzhi(dayGan, hour) {
  const zhi = hourToZhi(hour);
  const zhiIdx = DIZHI.indexOf(zhi);
  const dayGanIdx = TIANGAN.indexOf(dayGan);
  const base = [0,2,4,6,8,0,2,4,6,8][dayGanIdx];
  return { gan: TIANGAN[(base + zhiIdx) % 10], zhi };
}

// 五子遁元
const WUZI_BASE = { '甲':0,'己':0,'乙':2,'庚':2,'丙':4,'辛':4,'丁':6,'壬':6,'戊':8,'癸':8 };
function getGanForZhi(dayGan, zhi) {
  const baseIdx = WUZI_BASE[dayGan];
  const zhiIdx  = DIZHI.indexOf(zhi);
  return TIANGAN[(baseIdx + zhiIdx) % 10];
}

// ── 六亲 ──
function getLiuqin(selfWx, targetWx) {
  if (targetWx === selfWx) return '兄弟';
  if (WX_KE[selfWx] === targetWx) return '妻财';
  if (WX_KE[targetWx] === selfWx) return '官鬼';
  if (WX_SHENG[selfWx] === targetWx) return '子孙';
  if (WX_SHENG[targetWx] === selfWx) return '父母';
  return '兄弟';
}
function getLiuqinCls(name) {
  return { '妻财':'lq-妻财','官鬼':'lq-官鬼','子孙':'lq-子孙','父母':'lq-父母','兄弟':'lq-兄弟' }[name] || 'lq-兄弟';
}

// ============================================================
// 核心排盘算法
// ============================================================
function xiaoliu_paipan(year, month, day, hour, num) {
  const yearGz  = getYearGanzhi(year, month, day);
  const monthGz = getMonthGanzhi(year, month, day);
  const dayGz   = getDayGanzhi(year, month, day);
  const hourGz  = getHourGanzhi(dayGz.gan, hour);
  const shiZhi  = hourToZhi(hour);

  // 报数定自身宫（1~6）
  const selfGong = ((num % 6) + 6 - 1) % 6 + 1;

  // 起卦地支
  const startZhiIdx = DIZHI.indexOf(shiZhi);

  // 布地支：从自身宫起，每宫跳过一个地支
  const gongZhis = {};
  for (let i = 0; i < 6; i++) {
    const gongIdx = ((selfGong - 1 + i) % 6) + 1;
    const zhiIdx  = (startZhiIdx + i * 2) % 12;
    gongZhis[gongIdx] = DIZHI[zhiIdx];
  }

  // 五子遁元配天干
  const gongGanzhi = {};
  for (let g = 1; g <= 6; g++) {
    const zhi = gongZhis[g];
    const gan = getGanForZhi(dayGz.gan, zhi);
    gongGanzhi[g] = { gan, zhi };
  }

  // 纳音（含阴阳）
  const gongNayin = {};
  for (let g = 1; g <= 6; g++) {
    const { gan, zhi } = gongGanzhi[g];
    gongNayin[g] = getNayinInfo(gan, zhi);
  }

  // 十二神
  const gongShen = {};
  for (let g = 1; g <= 6; g++) {
    const { gan, zhi } = gongGanzhi[g];
    gongShen[g] = getShichen(gan, zhi, dayGz.gan, dayGz.zhi);
  }

  // 六亲
  const selfZhiWx = ZHI_WX[gongZhis[selfGong]];
  const gongLiuqin = {};
  for (let g = 1; g <= 6; g++) {
    const { zhi } = gongGanzhi[g];
    const gzWx = ZHI_WX[zhi];
    gongLiuqin[g] = getLiuqin(selfZhiWx, gzWx);
  }

  // 主宰神（日干神）
  const zaizai = getZaizaiShen(dayGz.gan, dayGz.zhi);

  // 推算过程
  const steps = [];
  steps.push({ label:'①报数定宫',
    text:`报数 ${num} ÷ 6 = ${Math.floor(num/6)} ··· ${num%6||6}，自身落入第 ${selfGong} 宫【${GONG_DATA[selfGong-1].name}】` });
  steps.push({ label:'②起卦地支',
    text:`${hour} 时 = ${shiZhi} 时，地支「${shiZhi}」填入第 ${selfGong} 宫（自身宫）` });

  let zhiSeq = '';
  for (let i = 0; i < 6; i++) {
    const gongIdx = ((selfGong - 1 + i) % 6) + 1;
    const zhi = gongZhis[gongIdx];
    const skipped = i > 0 ? `（跳${DIZHI[(startZhiIdx + i*2 - 1) % 12]}）` : '';
    zhiSeq += `${gongIdx}宫←${zhi}${skipped}  `;
  }
  steps.push({ label:'③布地支', text: zhiSeq.trim() });

  let ganzhiSeq2 = '';
  for (let g = 1; g <= 6; g++) {
    const { gan, zhi } = gongGanzhi[g];
    ganzhiSeq2 += `${g}宫→${gan}${zhi}  `;
  }
  steps.push({ label:'④五子遁元', text: `日干「${dayGz.gan}」，${ganzhiSeq2.trim()}` });

  let nySeq = '';
  for (let g = 1; g <= 6; g++) {
    const ny = gongNayin[g];
    nySeq += `${g}宫「${ny.name}」${ny.isYang?'阳':'阴'}纳音  `;
  }
  steps.push({ label:'⑤纳音', text: nySeq.trim() });

  let shenSeq = '';
  for (let g = 1; g <= 6; g++) {
    shenSeq += `${g}宫【${gongShen[g]}】  `;
  }
  steps.push({ label:'⑥十二神', text: shenSeq.trim() });

  const lqCounts = { '妻财':0,'官鬼':0,'子孙':0,'父母':0,'兄弟':0 };
  for (let g = 1; g <= 6; g++) lqCounts[gongLiuqin[g]]++;
  let lqSeq = Object.entries(lqCounts).filter(([,v])=>v>0).map(([k,v])=>`${k}${v}宫`).join('、');
  steps.push({ label:'⑦六亲', text: `以自身「${gongZhis[selfGong]}」（${selfZhiWx}）为基准：${lqSeq}` });

  return {
    yearGz, monthGz, dayGz, hourGz, shiZhi,
    selfGong, num,
    gongZhis, gongGanzhi, gongNayin, gongShen, gongLiuqin,
    selfZhiWx, zaizai,
    steps
  };
}

// ============================================================
// 断语生成
// ============================================================
function generateDuanyu(result, matter) {
  const { selfGong, gongGanzhi, gongNayin, gongShen, gongLiuqin, selfZhiWx, dayGz, gongZhis, zaizai } = result;
  const duanyu = [];
  const selfData = GONG_DATA[selfGong - 1];
  const selfGz   = gongGanzhi[selfGong];
  const selfNy   = gongNayin[selfGong];

  // 自身宫
  duanyu.push(`自身落入【${selfData.name}】（第${selfGong}宫），${selfData.detail[matter] || selfData.detail.general}`);

  // 主宰神
  duanyu.push(`🌟 主宰神：日干「${dayGz.gan}」，今日主宰神为【${zaizai}】，${zaizai}为本日用事之主，诸事可凭此神参断`);

  // 干支纳音阴阳
  duanyu.push(`自身宫干支「${selfGz.gan}${selfGz.zhi}」（${selfNy.isYang?'阳':'阴'}干支），纳音「${selfNy.name}」（${getNayinWx(selfNy.name)}）`);

  // 十二神分析
  const shenDetail = {};
  for (let g = 1; g <= 6; g++) {
    const shen = gongShen[g];
    const gz = gongGanzhi[g];
    const ny = gongNayin[g];
    const gd = GONG_DATA[g-1];
    if (!shenDetail[shen]) shenDetail[shen] = [];
    shenDetail[shen].push(`第${g}宫【${gd.name}】${gz.gan}${gz.zhi}（${ny.name}·${ny.isYang?'阳':'阴'}）`);
  }
  for (const [shen, arr] of Object.entries(shenDetail)) {
    const isZaiZai = shen === zaizai;
    duanyu.push(`${isZaiZai?'🌟':'⬤'}【${shen}】${isZaiZai?'（主宰神）':''}：${arr.join('、')}`);
  }

  // 六亲
  const lqDetail = {};
  for (let g = 1; g <= 6; g++) {
    const lq = gongLiuqin[g];
    const gz = gongGanzhi[g];
    const ny = gongNayin[g];
    const gd = GONG_DATA[g-1];
    if (!lqDetail[lq]) lqDetail[lq] = [];
    lqDetail[lq].push(`第${g}宫【${gd.name}】${gz.gan}${gz.zhi}（${ny.name}）`);
  }
  for (const [lq, arr] of Object.entries(lqDetail)) {
    if (arr.length > 0) duanyu.push(`【${lq}】${arr.join('、')}`);
  }

  // 空亡宫提示
  const kongGz = gongGanzhi[6];
  const kongNy  = gongNayin[6];
  duanyu.push(`⚠️ 空亡宫（第6宫）：${kongGz.gan}${kongGz.zhi}（${kongNy.name}·${kongNy.isYang?'阳':'阴'}），${gongShen[6]}神，谋事易落空`);

  return duanyu;
}

// ============================================================
// UI 渲染
// ============================================================
function setNow() {
  const now = new Date();
  document.getElementById('inp-year').value  = now.getFullYear();
  document.getElementById('inp-month').value = now.getMonth() + 1;
  document.getElementById('inp-day').value   = now.getDate();
  document.getElementById('inp-hour').value  = now.getHours();
  document.getElementById('inp-num').value  = '1';
}

function wxCls(wx) { return WX_CLS[wx] || ''; }

function paipan() {
  const year   = parseInt(document.getElementById('inp-year').value);
  const month  = parseInt(document.getElementById('inp-month').value);
  const day    = parseInt(document.getElementById('inp-day').value);
  const hour   = parseInt(document.getElementById('inp-hour').value);
  const num    = parseInt(document.getElementById('inp-num').value);

  if (!num || num < 1) { alert('请输入有效的报数（正整数）'); return; }

  const result = xiaoliu_paipan(year, month, day, hour, num);

  renderTimeBar(result, year, month, day, hour);
  renderGongRing(result);

  document.getElementById('result').classList.add('show');
  document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
}

function renderTimeBar(result, year, month, day, hour) {
  const { yearGz, monthGz, dayGz, hourGz, shiZhi, selfGong, zaizai } = result;
  const weekNames = ['日','一','二','三','四','五','六'];
  const week = weekNames[new Date(year, month-1, day).getDay()];
  document.getElementById('time-bar').innerHTML = `
    <div class="time-item"><div class="label">公历</div><div class="value">${year}/${month}/${day} ${String(hour).padStart(2,'0')}时</div></div>
    <div class="time-item"><div class="label">星期</div><div class="value">星期${week}</div></div>
    <div class="time-item"><div class="label">年柱</div><div class="value">${yearGz.gan}${yearGz.zhi}</div></div>
    <div class="time-item"><div class="label">月柱</div><div class="value">${monthGz.gan}${monthGz.zhi}</div></div>
    <div class="time-item"><div class="label">日柱</div><div class="value">${dayGz.gan}${dayGz.zhi}</div></div>
    <div class="time-item"><div class="label">时柱</div><div class="value">${hourGz.gan}${hourGz.zhi}</div></div>
    <div class="time-item"><div class="label">主宰神</div><div class="value" style="color:${shenColor(zaizai)}">${zaizai}</div></div>
    <div class="time-item"><div class="label">自身宫</div><div class="value" style="color:var(--gold)">第${selfGong}宫·${GONG_DATA[selfGong-1].name}</div></div>
  `;
}

function renderGongRing(result) {
  const { selfGong, gongGanzhi, gongNayin, gongShen, gongLiuqin, zaizai, dayGz } = result;
  const ringOrder = [2, 3, 4, 1, 6, 5];

  document.getElementById('gong-ring').innerHTML = ringOrder.map(gIdx => {
    const g = GONG_DATA[gIdx - 1];
    const gz = gongGanzhi[gIdx];
    const ny = gongNayin[gIdx];
    const shen = gongShen[gIdx];
    const lq = gongLiuqin[gIdx];
    const nyWx = getNayinWx(ny.name);
    const ganWx = GAN_WX[gz.gan];
    const zhiWx = ZHI_WX[gz.zhi];
    const isSelf = gIdx === selfGong;
    const isZaiZai = shen === zaizai;
    const lqCls = isSelf ? 'lq-自身' : getLiuqinCls(lq);

    return `
      <div class="gong-card gc-${gIdx} ${isSelf ? 'self-gong' : ''} ${isZaiZai ? 'zaizai-gong' : ''}"
           onclick="showGongDetail(${gIdx})" style="cursor:pointer">
        <div class="gong-num">第${gIdx}宫</div>
        <div class="gong-name">${g.name}</div>
        <div class="gong-jixiong ${g.jixiong_cls}">${g.jixiong}</div>
        <div class="gong-gz">
          <span class="${wxCls(ganWx)}">${gz.gan}</span><span class="${wxCls(zhiWx)}">${gz.zhi}</span>
        </div>
        <div class="gong-meta">${ny.isYang?'阳':'阴'} · ${ny.name}</div>
        <div class="gong-shen ${isZaiZai ? 'shen-zaizai' : ''}"
             style="color:${shenColor(shen)};${isZaiZai?'font-weight:bold;text-shadow:0 0 6px '+shenColor(shen):''}">
          ${shen}${isZaiZai?' ★':''}
        </div>
        <div class="gong-liuqin ${lqCls}">${isSelf?'自身':lq}</div>
        <div class="gong-desc">${g.desc}</div>
      </div>
    `;
  }).join('');

  // 保存当前结果供点击查看详情使用
  window._currentResult = result;
}

function showGongDetail(gIdx) {
  const result = window._currentResult;
  if (!result) return;

  const g = GONG_DATA[gIdx - 1];
  const gz = result.gongGanzhi[gIdx];
  const ny = result.gongNayin[gIdx];
  const shen = result.gongShen[gIdx];
  const lq = result.gongLiuqin[gIdx];
  const nyWx = getNayinWx(ny.name);
  const ganWx = GAN_WX[gz.gan];
  const zhiWx = ZHI_WX[gz.zhi];
  const isSelf = gIdx === result.selfGong;
  const isZaiZai = shen === result.zaizai;

  // 六亲关系说明
  const lqRelations = {
    '妻财': { '木':'我克火→子孙', '火':'我克土→子孙', '土':'我克金→子孙', '金':'我克水→子孙', '水':'我克木→子孙' },
    '官鬼': { '木':'金克木→官鬼', '火':'水克火→官鬼', '土':'木克土→官鬼', '金':'火克金→官鬼', '水':'土克水→官鬼' },
    '子孙': { '木':'木生火→子孙', '火':'火生土→子孙', '土':'土生金→子孙', '金':'金生水→子孙', '水':'水生木→子孙' },
    '父母': { '木':'水生木→父母', '火':'木生火→父母', '土':'火生土→父母', '金':'土生金→父母', '水':'金生水→父母' },
    '兄弟': { '木':'同木→兄弟', '火':'同火→兄弟', '土':'同土→兄弟', '金':'同金→兄弟', '水':'同水→兄弟' }
  };

  const selfWx = ZHI_WX[gz.zhi];
  const lqRel = lqRelations[lq] ? lqRelations[lq][nyWx] || '' : '';

  const detailHtml = `
    <div class="gong-detail-header">
      <div class="detail-title">第${gIdx}宫 · ${g.name}</div>
      <div class="detail-close" onclick="hideGongDetail()">×</div>
    </div>
    <div class="detail-content">
      <div class="detail-row">
        <span class="detail-label">宫位特性</span>
        <span class="gong-jixiong ${g.jixiong_cls}">${g.jixiong}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">基本含义</span>
        <span class="detail-value">${g.desc}</span>
      </div>
      <div class="detail-section">干支信息</div>
      <div class="detail-row">
        <span class="detail-label">天干</span>
        <span class="detail-value ${wxCls(ganWx)}">${gz.gan}（${ganWx}·${GAN_YY[gz.gan]}）</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">地支</span>
        <span class="detail-value ${wxCls(zhiWx)}">${gz.zhi}（${zhiWx}·${ZHI_YY[gz.zhi]}）</span>
      </div>
      ${SHIZHI_DETAILS[gz.zhi] ? `
      <div class="detail-shen-concept">
        <span class="detail-label">地支义</span>
        <span class="detail-value">${SHIZHI_DETAILS[gz.zhi].concepts}</span>
      </div>` : ''}
      <div class="detail-row">
        <span class="detail-label">纳音</span>
        <span class="detail-value">${ny.name}（${ny.isYang?'阳':'阴'}）</span>
      </div>
      <div class="detail-section">十二神</div>
      <div class="detail-row">
        <span class="detail-label">本宫神</span>
        <span class="detail-value" style="color:${shenColor(shen)}">${SHEN_DETAILS[shen] ? SHEN_DETAILS[shen].title : shen}</span>
      </div>
      ${SHEN_DETAILS[shen] ? `
      <div class="detail-shen-concept">
        <span class="detail-label">概念</span>
        <span class="detail-value">${SHEN_DETAILS[shen].concepts}</span>
      </div>
      <div class="detail-shen-geography">
        <span class="detail-label">地理</span>
        <span class="detail-value">${SHEN_DETAILS[shen].geography}</span>
      </div>
      <div class="detail-shen-animals">
        <span class="detail-label">动物</span>
        <span class="detail-value">${SHEN_DETAILS[shen].animals}</span>
      </div>
      <div class="detail-shen-plants">
        <span class="detail-label">植物</span>
        <span class="detail-value">${SHEN_DETAILS[shen].plants}</span>
      </div>
      <div class="detail-shen-objects">
        <span class="detail-label">静物</span>
        <span class="detail-value">${SHEN_DETAILS[shen].objects}</span>
      </div>
      <div class="detail-shen-people">
        <span class="detail-label">人物</span>
        <span class="detail-value">${SHEN_DETAILS[shen].people}</span>
      </div>` : ''}
      ${isZaiZai ? '<div class="detail-row"><span class="detail-label">主宰神</span><span class="detail-value zaizai">★ ' + result.zaizai + '（日干主神）</span></div>' : ''}
      <div class="detail-section">六亲关系</div>
      <div class="detail-row">
        <span class="detail-label">六亲</span>
        <span class="gong-liuqin ${isSelf ? 'lq-自身' : getLiuqinCls(lq)}">${isSelf?'自身':lq}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">与我关系</span>
        <span class="detail-value">${lqRel}</span>
      </div>
      ${!isSelf && LIUQIN_DETAILS[lq] ? `
      <div class="detail-shen-concept">
        <span class="detail-label">人物</span>
        <span class="detail-value">${LIUQIN_DETAILS[lq].people}</span>
      </div>
      <div class="detail-shen-geography">
        <span class="detail-label">事物</span>
        <span class="detail-value">${LIUQIN_DETAILS[lq].things}</span>
      </div>
      <div class="detail-shen-animals">
        <span class="detail-label">场所</span>
        <span class="detail-value">${LIUQIN_DETAILS[lq].places}</span>
      </div>
      <div class="detail-shen-plants">
        <span class="detail-label">性格</span>
        <span class="detail-value">${LIUQIN_DETAILS[lq].personality}</span>
      </div>
      <div class="detail-shen-objects">
        <span class="detail-label">天气</span>
        <span class="detail-value">${LIUQIN_DETAILS[lq].weather}</span>
      </div>` : ''}
      ${isSelf ? '<div class="detail-self-tip">自身宫为报数落宫，以此宫地支五行为"我"</div>' : ''}
      <div class="detail-section">六宫详解</div>
      <div class="detail-desc">${g.detail.general}</div>
    </div>
  `;

  let detailPanel = document.getElementById('gong-detail');
  if (!detailPanel) {
    detailPanel = document.createElement('div');
    detailPanel.id = 'gong-detail';
    document.getElementById('result').appendChild(detailPanel);
  }
  detailPanel.innerHTML = detailHtml;
  detailPanel.classList.add('show');
  detailPanel.scrollIntoView({ behavior: 'smooth' });
}

function hideGongDetail() {
  const detailPanel = document.getElementById('gong-detail');
  if (detailPanel) detailPanel.classList.remove('show');
}

// 页面加载
window.onload = setNow;
