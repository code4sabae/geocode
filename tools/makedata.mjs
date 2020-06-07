/*
# to make geocode/*.json
deno run -A download.mjs
sh makeisj.sh
gzcat temp/isj.txt.gz | deno run --allow-read makedata.mjs
*/

import { TextProtoReader } from "https://deno.land/std/textproto/mod.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";
import { getLGCode } from "https://code4sabae.github.io/lgcode/lgcode.mjs";
import Chome from "../Chome.mjs";

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
  if (line === null) break;
  cnt++;
  if (cnt % 10000 === 0) {
    console.log(cnt);
    // console.log(cnt, Object.keys(geocode).length);
  }
  const col = line.trim().replace(/"/g, "").split(",");
  if (col[0] === "都道府県名") { // v16
    // console.log(col);
    continue;
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
  const [pref, city, chome, alias, chiban, axis, x, y, lat, lng] = col;
  const chome2 = Chome.simplify(chome);
  const city2 = simplifyCity(city);
  const code = await getLGCode(pref, city2);
  // console.log(code, pref, city2, chome2, alias, chiban, lat, lng);
  if (code === null) { // v16 全データ ok!
    console.log(code, pref, city2, chome2, alias, chiban, lat, lng);
    Deno.exit(0);
  }

  const ar = geocode[code];
  const latlng = [lat, lng];
  if (!ar) {
    const v = {};
    v[chome2] = latlng;
    geocode[code] = v;
  } else {
    ar[chome2] = latlng;
  }

  // promises.push(db.put(name_code, JSON.stringify(json)));
  // db.put(name_code, JSON.stringify(json));
}

// Deno.writeTextFileSync("geocode.json", JSON.stringify(geocode));
// const geocode = JSON.parse(Deno.readTextFileSync("geocode.json"));
for (const code in geocode) {
  Deno.writeTextFileSync(
    `../data/geocode/${code}.json`,
    JSON.stringify(geocode[code]),
  );
}
