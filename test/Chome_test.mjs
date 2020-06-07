import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import Chome from "../Chome.mjs";

Deno.test("二丁目", () => {
  assertEquals(Chome.simplify("新横江二丁目"), "新横江2");
});
Deno.test("89", () => {
  assertEquals(Chome.simplify("新横江八十九丁目"), "新横江89");
});
Deno.test("丁目なし", () => {
  assertEquals(Chome.simplify("新横江"), "新横江");
});
Deno.test("なし", () => {
  assertEquals(Chome.simplify(""), "");
});
Deno.test("null", () => {
  assertEquals(Chome.simplify(null), null);
});
