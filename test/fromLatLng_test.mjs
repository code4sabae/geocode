import {
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts";

import { fromLatLng } from "../geocode.mjs";

Deno.test("fromLatLng", async () => {
  assertEquals(
    await fromLatLng(35.941043, 136.199640),
    [18207, ["福井県", "鯖江市"], "新横江2"],
  );
});
Deno.test("fromLatLng", async () => {
  assertEquals(
    await fromLatLng(35.941043, 136.199640 + 0.001),
    [18207, ["福井県", "鯖江市"], "新横江2"],
  );
});
Deno.test("fromLatLng", async () => {
  assertEquals(
    await fromLatLng(35.941043, 136.199640 + 0.01),
    [18207, ["福井県", "鯖江市"], "新町"],
  );
});
Deno.test("fromLatLng", async () => {
  assertEquals(
    await fromLatLng(34.841043, 136.199640),
    [24216, ["三重県", "伊賀市"], "中友田"],
  );
});
Deno.test("fromLatLng", async () => {
  assertEquals(
    await fromLatLng(43.061104, 141.356383),
    [1101, ["北海道", "札幌市", "中央区"], "大通西1"],
  );
});
