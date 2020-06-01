# 住所ジオコーディング

住所（現在は丁目レベル）から緯度経度を返すESモジュール geocode.mjs  

[![esmodules](https://taisukef.github.com/denolib/esmodulesbadge.svg)](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Modules)
[![deno](https://taisukef.github.com/denolib/denobadge.svg)](https://deno.land/)

## 使用例

```
import { getLatLng } from "https://code4sabae.github.io/geocode/geocode.mjs";

console.log(await getLatLng("福井県", "鯖江市", "新横江2"));
```

## 依存モジュール

地方公共団体コードモジュール lgcode.mjs  
https://github.com/code4sabae/lgcode  

## 出典

位置参照情報 ダウンロードサービス  
https://nlftp.mlit.go.jp/isj/  
