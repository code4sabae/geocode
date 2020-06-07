import Bounds from "../Bounds.mjs";

const map = {};

const path = "../data/geocode/";
const files = Deno.readDirSync(path);
for (const f of files) {
  if (!f.name.endsWith(".json")) continue;
  const code = parseInt(f.name.split(".")[0]);
  if (isNaN(code)) continue;
  const json = JSON.parse(Deno.readTextFileSync(path + f.name));
  const bounds = [];
  for (const name in json) {
    const ll = json[name].split(",").map((d) => parseFloat(d));
    Bounds.append(bounds, ll[0], ll[1]);
  }
  map[code] = bounds;
}
console.log(map);
Deno.writeTextFileSync("../data/geobounds.json", JSON.stringify(map));
