# 住所ジオコーディング・逆ジオコーディング（丁目レベル） geocode ES Modules ver.

住所（現在は丁目レベル）と緯度経度を相互変換するESモジュール geocode.mjs  
（84KB + 地方公共団体コード毎に1KB〜195KB）  

[![esmodules](https://taisukef.github.com/denolib/esmodulesbadge.svg)](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Modules)
[![deno](https://taisukef.github.com/denolib/denobadge.svg)](https://deno.land/)

## 使用例

```
import { getLatLng } from "https://code4sabae.github.io/geocode/geocode.mjs";

console.log(await getLatLng("福井県", "鯖江市", "新横江2"));
console.log(await fromLatLng(35.941043, 136.199640));
```

webアプリサンプル（ジオコーディング、逆ジオコーディング） [main.html](https://code4sabae.github.io/geocode/main.html)  

## データ作成

```
$ cd tools
$ deno run -A download.mjs
$ sh makeisj.sh
$ deno run -A makedata.mjs
$ deno run -A makegeobounds.mjs
```

## テスト

```
$ deno test -A
```

## 依存モジュール

地方公共団体コードモジュール lgcode.mjs  
https://github.com/code4sabae/lgcode  


## 出典

位置参照情報 ダウンロードサービス  
https://nlftp.mlit.go.jp/isj/  

## 関連記事

政府データを使って住所から緯度経度へ、丁目レベルのジオコーディング！ 住所変換コンポーネント移植の準備  
https://fukuno.jig.jp/2867  

日本政府発のJavaScriptライブラリを勝手にweb標準化するプロジェクト、全角-半角統一コンポーネントのESモジュール/Deno対応版公開  
https://fukuno.jig.jp/2865  

