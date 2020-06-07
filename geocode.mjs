import {
  getLGCode,
  fromLGCode,
} from "https://code4sabae.github.io/lgcode/lgcode.mjs";
import Bounds from "./Bounds.mjs";

const baseurl = "https://code4sabae.github.io/geocode/"; // from import.meta.url?
const fetchJSON = async (fn) => {
  if (
    import.meta && import.meta.url && import.meta.url.startsWith("file://") &&
    window.Deno
  ) {
    const url = import.meta.url;
    const path = url.substring("file://".length, url.lastIndexOf("/") + 1);
    return JSON.parse(await Deno.readTextFile(path + fn));
  }
  return await (await fetch(baseurl + fn)).json();
};

const geocodecache = {};
const getGeocode = async (code) => {
  const cache = geocodecache[code];
  if (cache) return cache;
  const data = await fetchJSON(`data/geocode/${code}.json`);
  geocodecache[code] = data;
  return data;
};

const getLatLng = async (name1, name2, chome) => { // 福井県 鯖江市、札幌市 中央区、など2つ指定
  if (chome == null) return null;
  const code = getLGCode(name1, name2);
  if (!code) return null;
  const citygeo = await getGeocode(code);
  if (!citygeo) return null;
  return citygeo[chome].split(",").map(d => parseFloat(d)); // TODO: data -> float[]
};

const getNearest = (geocode, lat, lng) => {
  let min = 1 << 30;
  let cmin = null;
  for (const n in geocode) {
    const [latn, lngn] = geocode[n].split(",").map((d) => parseFloat(d)); // TODO: data -> float[]
    const d = Math.abs(lat - latn) + Math.abs(lng - lngn);
    if (d < min) {
      min = d;
      cmin = n;
    }
  }
  return cmin;
};

let geobounds = null;
const fromLatLng = async (lat, lng) => {
  if (!geobounds) {
    geobounds = await fetchJSON("data/geobounds.json");
  }
  for (const lgcode in geobounds) { // lat1, lng1, lat2, lng2
    const r = geobounds[lgcode];
    if (Bounds.contains(r, lat, lng)) {
      const geocode = await getGeocode(lgcode);
      const c = getNearest(geocode, lat, lng);
      if (!c) return null;
      const adr = fromLGCode(lgcode);
      return [parseInt(lgcode), adr, c];
    }
  }
  return null;
};

export { getLatLng, getGeocode, fromLatLng };
