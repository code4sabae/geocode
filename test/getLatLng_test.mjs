import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { getLatLng } from "../geocode.mjs";

Deno.test("緯度経度取得", async () => {
  assertEquals(await getLatLng("福井県", "鯖江市", "新横江2"), [35.941043,136.199640]);
});

Deno.test("緯度経度取得 失敗（都道府県、市区町村、丁目まで必要）", async () => {
  assertEquals(await getLatLng("福井県", "鯖江市"), null);
});

Deno.test("緯度経度取得 失敗（都道府県間違い）", async () => {
  assertEquals(await getLatLng("福丼県", "鯖江市", "新横江2"), null);
});
