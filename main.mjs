import { getLGCode } from "https://code4sabae.github.io/japan/lgcode.mjs";
import { getLatLng } from "https://code4sabae.github.io/japan/geocode.mjs";

console.log(getLGCode("東京都", "新宿区"));
console.log(getLGCode("福井県", "鯖江市"));

console.log(await getLatLng("福井県", "鯖江市", "新横江2"));
