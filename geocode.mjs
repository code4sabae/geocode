import { getLGCode, findCity } from "https://code4sabae.github.io/lgcode/lgcode.mjs";

const geocodecache = {};
const getGeocode = async code => {
  const cache = geocodecache[code];
  if (cache) { return cache; };
  const fn = `geocode/${code}.json`;
  let data = null;
  if (import.meta && import.meta.url && import.meta.url.startsWith("file://") && window.Deno) {
    data = JSON.parse(await Deno.readTextFile("./" + fn));
  } else {
    data = await (await fetch("https://code4sabae.github.io/geocode/" + fn)).json();
  }
  geocodecache[code] = data;
  return data;
};

const getLatLng = async (prefname, cityname, chome) => {
  const code = getLGCode(prefname, cityname);
  // console.log("code", code);
  const citygeo = await getGeocode(code);
  // console.log(citygeo);
  const latlng = citygeo[chome];
  return latlng;
};

export { getLatLng };
