/*
位置参照情報 ダウンロードサービス
https://nlftp.mlit.go.jp/isj/
*/

const ver = "16.0a"; // 平成30年度

Deno.mkdirSync("temp");
for (let i = 1; i <= 47; i++) {
  const no = i < 10 ? `0${i}000` : `${i}000`;
  const url = `https://nlftp.mlit.go.jp/isj/dls/data/${ver}/${no}-${ver}.zip`;
  console.log(url);
  const res = await fetch(url);
  const bin = await res.arrayBuffer();
  const body = new Uint8Array(bin);
  Deno.writeFileSync(`temp/${no}.zip`, body);
  console.log(body.length + "bytes saved");
}
