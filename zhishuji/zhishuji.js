/**
 * 至数纪 v3 - 按传统时辰计时
 * 
 * 规则：
 * 1. 以冬至时刻为一年的起点
 * 2. 起始时间落在哪个时辰，那个时辰记为1
 * 3. 之后每跨过一个时辰边界，数字+1
 * 4. 数字1-9循环往复
 * 
 * 时辰对照（北京时间）：
 * 子时 23:00-01:00  丑时 01:00-03:00  寅时 03:00-05:00
 * 卯时 05:00-07:00  辰时 07:00-09:00  巳时 09:00-11:00
 * 午时 11:00-13:00  未时 13:00-15:00  申时 15:00-17:00
 * 酉时 17:00-19:00  戌时 19:00-21:00  亥时 21:00-23:00
 */

// ============================================================
// 时辰数据
// ============================================================
const SHICHEN = [
  { name: '子', start: 23, end: 1 },
  { name: '丑', start: 1, end: 3 },
  { name: '寅', start: 3, end: 5 },
  { name: '卯', start: 5, end: 7 },
  { name: '辰', start: 7, end: 9 },
  { name: '巳', start: 9, end: 11 },
  { name: '午', start: 11, end: 13 },
  { name: '未', start: 13, end: 15 },
  { name: '申', start: 15, end: 17 },
  { name: '酉', start: 17, end: 19 },
  { name: '戌', start: 19, end: 21 },
  { name: '亥', start: 21, end: 23 },
];

// 获取某时刻所在的时辰信息
function getShichenInfo(date) {
  const h = date.getHours();
  const m = date.getMinutes();
  
  // 找到所在时辰
  for (let i = 0; i < SHICHEN.length; i++) {
    const sc = SHICHEN[i];
    // 子时特殊：跨日期
    if (sc.start === 23) {
      if (h >= 23 || h < 1) {
        return {
          index: i,
          name: sc.name + '时',
          startHour: 23,
          endHour: 1,
          // 计算该时辰的起始时间
          getStartTime: (baseDate) => {
            const d = new Date(baseDate);
            if (h >= 23) {
              d.setHours(23, 0, 0, 0);
            } else {
              d.setDate(d.getDate() - 1);
              d.setHours(23, 0, 0, 0);
            }
            return d;
          }
        };
      }
    } else {
      if (h >= sc.start && h < sc.end) {
        return {
          index: i,
          name: sc.name + '时',
          startHour: sc.start,
          endHour: sc.end,
          getStartTime: (baseDate) => {
            const d = new Date(baseDate);
            d.setHours(sc.start, 0, 0, 0);
            return d;
          }
        };
      }
    }
  }
  return null;
}

// 获取当前时辰的结束时间（下一个时辰的开始）
function getCurrentShichenEnd(date) {
  const h = date.getHours();
  
  // 时辰边界时刻
  const boundaries = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23];
  
  for (const b of boundaries) {
    if (h < b) {
      // 找到第一个大于当前小时的边界
      const end = new Date(date);
      end.setHours(b, 0, 0, 0);
      return end;
    }
  }
  
  // 如果超过23点，下一个是明天1点
  const end = new Date(date);
  end.setDate(end.getDate() + 1);
  end.setHours(1, 0, 0, 0);
  return end;
}

// 获取下一个时辰边界（用于倒计时）
function getNextShichenTime(date) {
  return getCurrentShichenEnd(date);
}

// ============================================================
// 核心计算
// ============================================================

/**
 * 计算当前数字
 * 从起始时间所在时辰开始记为1，每过一个时辰+1，1-9循环
 */
function calculate(now, startTime) {
  const startMs = new Date(startTime).getTime();
  const nowMs = now.getTime();
  
  if (nowMs < startMs) {
    // 还未开始
    return {
      num: 0,
      notStarted: true,
      untilStart: startMs - nowMs
    };
  }
  
  // 获取起始时间所在的时辰信息
  const startDate = new Date(startTime);
  const startShichen = getShichenInfo(startDate);
  
  // 获取起始时辰的结束时间（即下一时辰的开始）
  const startShichenEnd = getCurrentShichenEnd(startDate);
  
  // 如果当前时间还在起始时辰内，数字为0（等待中）
  if (nowMs < startShichenEnd.getTime()) {
    return {
      num: 0,
      waiting: true,
      untilNext: startShichenEnd.getTime() - nowMs,
      startShichenName: startShichen.name,
      nextShichenName: SHICHEN[(startShichen.index + 1) % 12].name + '时'
    };
  }
  
  // 从下一时辰开始计数
  const shichenMs = 2 * 60 * 60 * 1000;
  const nextShichenStart = getCurrentShichenEnd(startDate); // 起始时辰结束 = 计数开始
  
  // 获取当前时间所在的时辰
  const currentShichen = getShichenInfo(now);
  const currentShichenStart = currentShichen.getStartTime(now);
  
  // 经过的完整时辰数（从计数起点开始）
  const elapsedShichen = Math.floor((nowMs - nextShichenStart.getTime()) / shichenMs);
  
  // 当前数字（从1开始）
  const num = (elapsedShichen % 9) + 1;
  
  // 循环轮次
  const cycleCount = Math.floor(elapsedShichen / 9) + 1;
  
  // 当前时辰内的进度
  const inShichenMs = nowMs - currentShichenStart.getTime();
  const progress = inShichenMs / shichenMs;
  
  // 距离下一个时辰
  const nextShichenTime = getNextShichenTime(now);
  const nextInMs = nextShichenTime.getTime() - nowMs;
  
  return {
    num,
    shichenName: currentShichen.name,
    cycleCount,
    elapsedShichen,
    progress,
    nextInMs,
    nextShichenTime,
    shichenMs,
    startShichenName: startShichen.name
  };
}

// 预计算结束时的数字
function calcEndNumber(startTime, endTime) {
  const startMs = new Date(startTime).getTime();
  const endMs = new Date(endTime).getTime();
  
  if (isNaN(startMs) || isNaN(endMs) || endMs <= startMs) {
    return null;
  }
  
  const startDate = new Date(startTime);
  const startShichen = getShichenInfo(startDate);
  const startShichenEnd = getCurrentShichenEnd(startDate);
  
  // 计数起点 = 起始时辰结束
  const countStartMs = startShichenEnd.getTime();
  
  // 如果结束时间在起始时辰内，还未开始计数
  if (endMs <= countStartMs) {
    return {
      endNum: 0,
      cycleCount: 0,
      elapsedShichen: 0,
      endShichenName: startShichen.name + '（未开始计数）',
      duration: endMs - startMs,
      notStarted: true
    };
  }
  
  const shichenMs = 2 * 60 * 60 * 1000;
  const elapsedShichen = Math.floor((endMs - countStartMs) / shichenMs);
  const endNum = (elapsedShichen % 9) + 1;
  const cycleCount = Math.floor(elapsedShichen / 9) + 1;
  
  // 结束时间所在的时辰
  const endDate = new Date(endTime);
  const endShichen = getShichenInfo(endDate);
  
  return {
    endNum,
    cycleCount,
    elapsedShichen,
    endShichenName: endShichen.name,
    duration: endMs - startMs
  };
}

// ============================================================
// 格式化
// ============================================================

function formatTime(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
}

function formatDuration(ms) {
  if (ms < 0) ms = 0;
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  
  if (days > 0) {
    return `${days}天 ${hours}时 ${minutes}分`;
  } else if (hours > 0) {
    return `${hours}时 ${minutes}分 ${seconds}秒`;
  } else {
    return `${minutes}分 ${seconds}秒`;
  }
}

function formatCountdown(ms) {
  if (ms < 0) ms = 0;
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
}

// ============================================================
// 状态
// ============================================================
let config = {
  startTime: '2025-12-21T23:02',
  endTime: ''
};

function loadConfig() {
  const saved = localStorage.getItem('zhishuji_config');
  if (saved) {
    try { config = JSON.parse(saved); } catch (e) {}
  }
}
function saveConfig() {
  localStorage.setItem('zhishuji_config', JSON.stringify(config));
}

// ============================================================
// UI
// ============================================================

function update() {
  const now = new Date();
  const result = calculate(now, config.startTime);
  
  if (result.notStarted) {
    document.getElementById('main-number').textContent = '等';
    document.getElementById('cycle-label').innerHTML = 
      `距离开始还有 <span style="color:var(--gold2)">${formatDuration(result.untilStart)}</span>`;
    document.getElementById('now-time').textContent = formatTime(now);
    document.getElementById('start-time').textContent = formatTime(new Date(config.startTime));
    document.getElementById('elapsed').textContent = '未开始';
    document.getElementById('current-shichen').textContent = '-';
    document.getElementById('progress-fill').style.width = '0%';
    document.getElementById('progress-text').textContent = '等待中...';
    document.getElementById('next-countdown').textContent = formatCountdown(result.untilStart);
    document.getElementById('meaning-text').textContent = '起点尚未到达，静待时机。';
    return;
  }
  
  if (result.waiting) {
    // 当前处于起始时辰，等待计数开始
    document.getElementById('main-number').textContent = '待';
    document.getElementById('cycle-label').innerHTML = 
      `${result.startShichenName}不计数 · 到${result.nextShichenName}开始`;
    document.getElementById('now-time').textContent = formatTime(now);
    document.getElementById('start-time').textContent = formatTime(new Date(config.startTime));
    document.getElementById('elapsed').textContent = `${result.startShichenName}（不计数）`;
    document.getElementById('current-shichen').textContent = result.startShichenName + '（待计数）';
    
    // 计算到计数开始的进度
    const startMs = new Date(config.startTime).getTime();
    const totalWait = result.untilNext + (now.getTime() - startMs);
    const waitProgress = (now.getTime() - startMs) / totalWait;
    document.getElementById('progress-fill').style.width = Math.min(100, waitProgress * 100) + '%';
    document.getElementById('progress-text').textContent = '等待中...';
    document.getElementById('next-countdown').textContent = formatCountdown(result.untilNext);
    document.getElementById('meaning-text').textContent = `${result.startShichenName}不计入计时，${result.nextShichenName}开始记录为1。`;
    return;
  }
  
  // 主数字
  document.getElementById('main-number').textContent = result.num;
  
  // 轮次
  document.getElementById('cycle-label').textContent = `第 ${result.cycleCount} 轮循环`;
  
  // 当前时间
  document.getElementById('now-time').textContent = formatTime(now);
  
  // 起始时间
  document.getElementById('start-time').textContent = 
    `${formatTime(new Date(config.startTime))}（${result.startShichenName}）`;
  
  // 距起点
  document.getElementById('elapsed').textContent = 
    `${formatDuration(now.getTime() - new Date(config.startTime).getTime())} / ${result.elapsedShichen} 个时辰`;
  
  // 当前时辰
  document.getElementById('current-shichen').textContent = result.shichenName;
  
  // 进度条
  const progressPct = Math.floor(result.progress * 100);
  document.getElementById('progress-fill').style.width = progressPct + '%';
  document.getElementById('progress-text').textContent = 
    `${result.shichenName} · ${progressPct}% · 还剩 ${formatCountdown(result.nextInMs)}`;
  
  // 倒计时
  document.getElementById('next-countdown').textContent = formatCountdown(result.nextInMs);
  
  // 九宫格
  const grid = document.getElementById('grid-9');
  grid.innerHTML = '';
  for (let i = 1; i <= 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell' + (i === result.num ? ' active' : '');
    cell.textContent = i;
    grid.appendChild(cell);
  }
  
  // 含义
  const meanings = {
    1: '一阳初生，万象更新。冬至子时，阳气始动。',
    2: '二阳渐进，丑时蓄力。生机暗涌，静待时机。',
    3: '三阳开泰，寅时破晓。黎明将至，进取有时。',
    4: '四象方成，卯时日出。朝阳初升，诸事顺遂。',
    5: '五行流转，辰时龙腾。万物复苏，顺势而行。',
    6: '六合既定，巳时日盛。精力充沛，把握机遇。',
    7: '七星高照，午时正阳。日中则昃，当思进退。',
    8: '八方来气，未时日斜。午后渐静，宜守不宜攻。',
    9: '九九归一，申时日落。循环将尽，待时而动。'
  };
  document.getElementById('meaning-text').textContent = meanings[result.num] || '';
  
  // 结束时间检查
  if (config.endTime) {
    const endMs = new Date(config.endTime).getTime();
    const remaining = endMs - now.getTime();
    if (remaining > 0) {
      document.getElementById('end-row').style.display = 'flex';
      document.getElementById('remaining').textContent = formatDuration(remaining);
    } else {
      document.getElementById('main-number').textContent = '终';
      document.getElementById('cycle-label').textContent = '计时已结束';
      document.getElementById('meaning-text').textContent = '终点已至，一轮循环圆满结束。';
    }
  } else {
    document.getElementById('end-row').style.display = 'none';
  }
}

// 设置面板
function toggleSettings() {
  const panel = document.getElementById('settings-panel');
  panel.classList.toggle('show');
  if (panel.classList.contains('show')) {
    document.getElementById('inp-start').value = config.startTime;
    document.getElementById('inp-end').value = config.endTime;
    calcEndNum();
  }
}

function calcEndNum() {
  const startTime = document.getElementById('inp-start').value;
  const endTime = document.getElementById('inp-end').value;
  
  const group = document.getElementById('end-result-group');
  
  if (!endTime) {
    group.style.display = 'none';
    return;
  }
  
  const result = calcEndNumber(startTime, endTime);
  if (!result) {
    group.style.display = 'none';
    return;
  }
  
  group.style.display = 'block';
  document.getElementById('end-number').textContent = result.endNum;
  document.getElementById('end-duration').textContent = formatDuration(result.duration);
  document.getElementById('end-cycle').textContent = 
    `第 ${result.cycleCount} 轮 · ${result.endShichenName}`;
}

function saveSettings() {
  config.startTime = document.getElementById('inp-start').value;
  config.endTime = document.getElementById('inp-end').value;
  saveConfig();
  toggleSettings();
  update();
}

function resetSettings() {
  config = { startTime: '2025-12-21T23:02', endTime: '' };
  saveConfig();
  document.getElementById('inp-start').value = config.startTime;
  document.getElementById('inp-end').value = config.endTime;
  calcEndNum();
  update();
}

function setPreset(type) {
  const now = new Date();
  switch (type) {
    case 'zhishu2025':
      document.getElementById('inp-start').value = '2025-12-21T23:02';
      break;
    case 'zhishu2026':
      document.getElementById('inp-start').value = '2026-12-22T05:42';
      break;
    case 'today':
      document.getElementById('inp-start').value = 
        `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}T00:00`;
      break;
    case 'now':
      document.getElementById('inp-start').value = 
        `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}T${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      break;
  }
  calcEndNum();
}

// 初始化
loadConfig();
update();
setInterval(update, 1000);
