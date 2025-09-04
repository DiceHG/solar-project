import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

// ESM-safe __dirname / __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIG
const INPUT_CSV = path.resolve(
  __dirname,
  "../dataset/global_horizontal_means.csv"
);
const OUTPUT_DIR = path.resolve(__dirname, "../dataset");
const OUTPUT_BIN = path.join(OUTPUT_DIR, "solar_irradiation_dataset.bin");
const OUTPUT_META = path.join(OUTPUT_DIR, "solar_irradiation_metadata.json");

// Data storage
const points = [];

// Read the .csv
async function readCSV() {
  const rl = readline.createInterface({
    input: fs.createReadStream(INPUT_CSV),
    crlfDelay: Infinity,
  });

  let isFirstLine = true;

  for await (const line of rl) {
    // line -> "ID; COUNTRY; LON; LAT; ANNUAL; JAN; FEB; MAR; APR; MAY; JUN; JUL; AUG; SEP; OCT; NOV; DEC"

    // jumps the header row
    if (isFirstLine) {
      isFirstLine = false;
      continue;
    }

    const cols = line.split(";"); // cols -> [ID, COUNTRY, LON, LAT, ANNUAL, JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC]
    const point = {
      lat: parseFloat(cols[3]), // now a number
      lng: parseFloat(cols[2]), // now a number
      months: cols.slice(5, 17).map((v) => parseInt(v)), // months -> [JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC] now as numbers
    };
    points.push(point); // push it to the data storage
  }
}

// Compute grid dimensions
function computeGridInfo() {
  const lats = Array.from(new Set(points.map((p) => p.lat))).sort(
    (a, b) => a - b
  );
  const lngs = Array.from(new Set(points.map((p) => p.lng))).sort(
    (a, b) => a - b
  );

  const minLat = lats[0];
  const minLng = lngs[0];
  const stepLat = +(lats[1] - lats[0]).toFixed(4);
  const stepLng = +(lngs[1] - lngs[0]).toFixed(4);
  const nLat = lats.length;
  const nLng = lngs.length;

  return { minLat, minLng, stepLat, stepLng, nLat, nLng };
}

// Fill monthly arrays and write to .bin
function writeBinary() {
  const { minLat, minLng, stepLat, stepLng, nLat, nLng } = computeGridInfo();
  const arrays = Array.from({ length: 12 }, () =>
    new Float32Array(nLat * nLng).fill(-1)
  );

  for (const p of points) {
    const i = Math.round((p.lat - minLat) / stepLat);
    const j = Math.round((p.lng - minLng) / stepLng);
    const idx = i * nLng + j;
    p.months.forEach((val, monthIdx) => {
      arrays[monthIdx][idx] = val;
    });
  }

  const buffer = Buffer.concat(arrays.map((arr) => Buffer.from(arr.buffer)));
  fs.writeFileSync(OUTPUT_BIN, buffer);
  const meta = { minLat, minLng, stepLat, stepLng, nLat, nLng };
  fs.writeFileSync(OUTPUT_META, JSON.stringify(meta, null, 2));
  console.log(`Saved to: ${OUTPUT_BIN}`);
  console.log(`Grid: ${nLat} lat x ${nLng} lng`);
  console.log(
    `minLat: ${minLat}, minLng: ${minLng}, step: ${stepLat}, ${stepLng}`
  );
}

// Run the conversion
(async () => {
  await readCSV();
  writeBinary();
})();
