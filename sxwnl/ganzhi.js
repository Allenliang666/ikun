// ikun天文历干支计算接口
// 使用方法：
//   getGanZhi(year, month, day, hour) 返回 {yn, ym, yd, yh} 年月日时干支
// 依赖：需在页面中先引入 sxwnl_core.js

function getGanZhiFromSxwnl(year, month, day, hour) {
  // 将公历转为儒略日
  var Y = year, M = month, D = day + (hour / 24.0);
  var a = Math.floor((14 - M) / 12);
  var y = Y + 4800 - a;
  var m = M + 12 * a - 3;
  var jd = D + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4)
         - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  jd = jd - 0.5; // 转为儒略日（从正午开始）

  // 调用obb.mingLiBaZi
  var ob = {};
  var J2000 = 2451545; // J2000.0
  var radd = Math.PI / 180;
  var lon = 120; // 东经120度（北京时间）
  obb.mingLiBaZi(jd - J2000, lon * radd, ob);

  return {
    yn: ob.bz_jn || '',  // 年柱
    ym: ob.bz_jy || '',  // 月柱
    yd: ob.bz_jr || '',  // 日柱
    yh: ob.bz_js || ''   // 时柱
  };
}
