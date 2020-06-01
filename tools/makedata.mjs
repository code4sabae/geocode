/*
# to make geocode/*.json
deno run -A download.mjs
sh makeisj.sh
gzcat temp/isj.txt.gz | deno run --allow-read makedata.mjs
*/

import { TextProtoReader } from "https://deno.land/std/textproto/mod.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";
import { getLGCode } from "https://code4sabae.github.io/lgcode/lgcode.mjs";

const CHOME = [
  "〇", "一", "二", "三", "四", "五", "六", "七", "八", "九",
  "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九",
  "二十", "二十一", "二十二", "二十三", "二十四", "二十五", "二十六", "二十七", "二十八", "二十九",
  "三十", "三十一", "三十二", "三十三", "三十四", "三十五", "三十六", "三十七", "三十八", "三十九",
  "四十", "四十一", "四十二", "四十三", "四十四", "四十五", "四十六", "四十七", "四十八", "四十九",
  "五十", "五十一", "五十二", "五十三", "五十四", "五十五", "五十六", "五十七", "五十八", "五十九",
  "六十", "六十一", "六十二", "六十三", "六十四", "六十五", "六十六", "六十七", "六十八", "六十九",
  "七十", "七十一", "七十二", "七十三", "七十四", "七十五", "七十六", "七十七", "七十八", "七十九",
  "八十", "八十一", "八十二", "八十三", "八十四", "八十五", "八十六", "八十七", "八十八", "八十九",
  "九十", "九十一", "九十二", "九十三", "九十四", "九十五", "九十六", "九十七", "九十八", "九十九"
];
const simplifyChome = function (chome) {
  if (!chome.endsWith("丁目")) { return chome; }
  A: for (let i = CHOME.length - 1; i >= 0; i--) {
    const c = CHOME[i];
    const off = chome.length - 2 - c.length;
    if (c.length + 2 >= chome.length) { continue; }
    for (let j = c.length - 1; j >= 0; j--) {
      if (c.charCodeAt(j) !== chome.charCodeAt(off + j)) { continue A; }
    }
    return chome.substring(0, off) + i;
  }
  return chome;
}
// console.log(simplifyChome("新横江二丁目")); // -> 新横江2
// console.log(simplifyChome("新横江八十九丁目")); // -> 新横江89
// Deno.exit(0);

const simplifyCity = function (cityname) {
  // 市と区、分離
  if (cityname.endsWith("区")) {
    const n = cityname.indexOf("市");
    if (n > 0) {
      return cityname.substring(n + 1);
    }
  }
  // 群、分離
  if (cityname.endsWith("町") || cityname.endsWith("村")) {
    const n = cityname.indexOf("郡");
    if (n > 0) {
      return cityname.substring(n + 1);
    }
  }
  return cityname;
};

// citycode: [ chome2: { lat, lng } ] // chiban 無視
const geocode = {};

const input = new TextProtoReader(new BufReader(Deno.stdin)); // 18,440,000 lines
let cnt = 0;
for (;;) {
  const line = await input.readLine();
  // console.log(line);
  if (line === null) { break; }
  cnt++;
  if (cnt % 10000 === 0) {
    console.log(cnt);
    // console.log(cnt, Object.keys(geocode).length);
  }
  const col = line.trim().replace(/"/g, "").split(",");
  if (col[0] === "都道府県名") { // v16
    // console.log(col);
    continue
  }
  if (col.length !== 14) { // 異常なレコードはスキップ、"岩手県", "盛岡市", "上太田上都道府県名"
    console.log(col, col.length);
    // Deno.exit(0);
    continue; 
  }
  /*
"都道府県名", 
"市区町村名",
  "大字・丁目名", 
  "小字・通称名",
  "街区符号・地番",
   "座標系番号",
  "Ｘ座標", 
  "Ｙ座標",
  "緯度",
   "経度",
  "住居表示フラグ", 
  "代表フラグ",
  "更新前履歴フラグ", 
  "更新後履歴フラグ"
    */
  const [ pref, city, chome, alias, chiban, axis, x, y, lat, lng ] = col;
  const chome2 = simplifyChome(chome);
  const city2 = simplifyCity(city);
  const code = await getLGCode(pref, city2);
  // console.log(code, pref, city2, chome2, alias, chiban, lat, lng);
  if (code === null) { // v16 全データ ok!
    console.log(code, pref, city2, chome2, alias, chiban, lat, lng);
    Deno.exit(0);
  }

  const ar = geocode[code];
  const latlng = lat + "," + lng;
  if (!ar) {
    const v = {};
    v[chome2] = latlng;
    geocode[code] = v
  } else {
    ar[chome2] = latlng;
  }
  
  // promises.push(db.put(name_code, JSON.stringify(json)));
  // db.put(name_code, JSON.stringify(json));
}

// Deno.writeTextFileSync("geocode.json", JSON.stringify(geocode));
// const geocode = JSON.parse(Deno.readTextFileSync("geocode.json"));
for (const code in geocode) {
  Deno.writeTextFileSync(`../geocode/${code}.json`, JSON.stringify(geocode[code]));
}
