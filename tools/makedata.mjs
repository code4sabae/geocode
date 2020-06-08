/*
# to make geocode/*.json
deno run -A download.mjs
sh makeisj.sh
sh makedata.sh
*/

import { TextProtoReader } from "https://deno.land/std/textproto/mod.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";
import { getLGCode } from "https://code4sabae.github.io/lgcode/lgcode.mjs";
// import { getLGCode } from "../../japan/lgcode.mjs";
import Chome from "../Chome.mjs";

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
  let city2 = city;
  if (city2 === "篠山市") city2 = "丹波篠山市"; // v16は丹波篠山市に改名する前のデータ
  if (pref === "福岡県" || city2 === "筑紫郡那珂川町") city2 = "那珂川市"; // v16は那珂川市に改名する前のデータ
  const code = await getLGCode(pref, city2);
  if (Array.isArray(code)) {
    console.log(pref, city, code);
    Deno.exit(0);
  }
  // console.log(code, pref, city2, chome2, alias, chiban, lat, lng);
  if (code === null) { // v16 全データ ok!
    console.log(code, pref, city, alias, chiban, lat, lng);
    // null 兵庫県 篠山市 今田町本荘  22 34.999361 135.073946
    Deno.exit(0);
  }

  const chome2 = Chome.simplify(chome);
  const ar = geocode[code];
  const latlng = [lat, lng].map(d => parseFloat(d));
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
