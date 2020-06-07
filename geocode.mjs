import { getLGCode } from "https://code4sabae.github.io/lgcode/lgcode.mjs";

const geocodecache = {};
const getGeocode = async code => {
  const cache = geocodecache[code];
  if (cache) { return cache; };
  const fn = `geocode/${code}.json`;
  let data = null;
  if (import.meta && import.meta.url && import.meta.url.startsWith("file://") && window.Deno) {
    const url = import.meta.url;
    const path = url.substring("file://".length, url.lastIndexOf("/") + 1);
    data = JSON.parse(await Deno.readTextFile(path + fn));
  } else {
    data = await (await fetch("https://code4sabae.github.io/geocode/" + fn)).json();
  }
  geocodecache[code] = data;
  return data;
};

const getLatLng = async (name1, name2, chome) => { // 福井県 鯖江市、札幌市 中央区、など2つ指定
  if (chome == null) { return null; }
  const code = getLGCode(name1, name2);
  if (!code) { return null; }
  const citygeo = await getGeocode(code);
  if (!citygeo) { return null; }
  return citygeo[chome];
};

export { getLatLng, getGeocode };
