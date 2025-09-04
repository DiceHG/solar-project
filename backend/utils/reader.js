import path from "path";
import fs from "fs";
import { open } from "fs/promises";
import { fileURLToPath } from "url";

// ESM-safe __dirname / __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIG
const BIN_PATH = path.resolve(
  __dirname,
  "../dataset/solar_irradiation_dataset.bin"
);
const METADATA_PATH = path.resolve(
  __dirname,
  "../dataset/solar_irradiation_metadata.json"
);

export const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

/**
 * Load metadata JSON { minLat, minLng, stepLat, stepLng, nLat, nLng }
 */
const loadMetadata = () => {
  const meta = JSON.parse(fs.readFileSync(METADATA_PATH, "utf8"));
  const { minLat, minLng, stepLat, stepLng, nLat, nLng } = meta;
  return { minLat, minLng, stepLat, stepLng, nLat, nLng };
};

const degreesToRads = (lat, lng) => {
  return {
    lat: (lat * Math.PI) / 180,
    lng: (lng * Math.PI) / 180,
  };
};

const indexToRads = (idx) => {
  const { minLat, minLng, stepLat, stepLng, nLng } = loadMetadata();
  const j = idx % nLng;
  const i = (idx - j) / nLng;
  return {
    lat: ((minLat + i * stepLat) * Math.PI) / 180,
    lng: ((minLng + j * stepLng) * Math.PI) / 180,
  };
};

/**
 * Compute the 4 nearest grid indexes from lat/lng.
 */
const nearestIndexes = (lat, lng) => {
  const { minLat, minLng, stepLat, stepLng, nLat, nLng } = loadMetadata();

  const i0 = Math.floor((lat - minLat) / stepLat);
  const i1 = Math.ceil((lat - minLat) / stepLat);
  const j0 = Math.floor((lng - minLng) / stepLng);
  const j1 = Math.ceil((lng - minLng) / stepLng);

  // Clamp to valid range
  const clampedI0 = Math.max(0, Math.min(i0, nLat - 1));
  const clampedI1 = Math.max(0, Math.min(i1, nLat - 1));
  const clampedJ0 = Math.max(0, Math.min(j0, nLng - 1));
  const clampedJ1 = Math.max(0, Math.min(j1, nLng - 1));

  return [
    clampedI0 * nLng + clampedJ0,
    clampedI0 * nLng + clampedJ1,
    clampedI1 * nLng + clampedJ0,
    clampedI1 * nLng + clampedJ1,
  ];
};

const haversineD = (coords1, coords2) => {
  const R = 6371; // Approximate radius of Earth in kilometers
  const phi1 = coords1.lat;
  const phi2 = coords2.lat;
  const deltaPhi = coords2.lat - coords1.lat;
  const deltaLambda = coords2.lng - coords1.lng;

  const a =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
  const d = 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return d; // kilometers
};

const fetchSolarIrradiation = async (idx) => {
  const { nLat, nLng } = loadMetadata();
  const bytesPerArray = nLat * nLng * 4;
  const valueOffsetInMonth = idx * 4;

  const fh = await open(BIN_PATH, "r");
  try {
    const months = {};
    for (let m = 0; m < 12; m++) {
      const fileOffset = m * bytesPerArray + valueOffsetInMonth;
      const { buffer } = await fh.read({
        buffer: Buffer.allocUnsafe(4),
        length: 4,
        position: fileOffset,
      });
      months[MONTHS[m]] = buffer.readFloatLE(0);
    }
    const allInvalid = Object.values(months).every((v) => v === -1);
    if (allInvalid) {
      return { message: "Point outside of Brazil" };
    }
    return { idx, months };
  } finally {
    await fh.close();
  }
};

export const fetchPointData = async (lat, lng) => {
  const indexes = nearestIndexes(lat, lng);
  const point1 = degreesToRads(lat, lng);

  const results = await Promise.all(
    indexes.map(async (idx) => {
      const point2 = indexToRads(idx);
      const distance = haversineD(point1, point2);
      const data = await fetchSolarIrradiation(idx);
      return { ...data, distance };
    })
  );
  results.sort((a, b) => a.distance - b.distance);

  return results;
};

// Test
await fetchPointData(-23.4260085294191, -51.93827995077938).then(console.log);
await fetchPointData(-23.904316964801307, -54.74639412301441).then(console.log);
