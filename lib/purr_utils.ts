export function humanFileSize(num: number, suffix: string = "B"): string {
  num = Math.floor(num);
  const units = ["", "K", "M", "G", "T", "P", "E", "Z"];

  for (const unit of units) {
    if (Math.abs(num) < 1024) {
      return `${num.toFixed(1)}${unit}${suffix}`;
    }
    num /= 1024;
  }
  return `${num.toFixed(1)}Y${suffix}`;
}

export const ASSETS = [
  "well",
  "core",
  "dst",
  "formation",
  "ip",
  "perforation",
  "production",
  "raster_log",
  "survey",
  "vector_log",
  "zone",
];

export const GEOTYPES = ["geographix", "petra", "kingdom", "las"];

function calculateSignedArea(polygon: number[][]): number {
  let sum = 0;
  const n = polygon.length;
  for (let i = 0; i < n; i++) {
    const current = polygon[i];
    const next = polygon[(i + 1) % n];
    sum += (next[0] + current[0]) * (next[1] - current[1]);
  }
  return sum / 2;
}

export function polygonCentroid(polygon: number[][]): [number, number] {
  const n = polygon.length;
  let cx = 0,
    cy = 0;
  const signedArea = calculateSignedArea(polygon);
  for (let i = 0; i < n; i++) {
    const current = polygon[i];
    const next = polygon[(i + 1) % n];
    const factor = current[0] * next[1] - next[0] * current[1];
    cx += (current[0] + next[0]) * factor;
    cy += (current[1] + next[1]) * factor;
  }
  cx /= 6 * signedArea;
  cy /= 6 * signedArea;

  // note that pigeon wants y/x
  return [cy, cx];
}

// Thanks ChatGPT, but the calculated zoom using pigeon-map's default tile
// (OpenStreetMap) is only vaguely correct if we ignore TILE_SIZE. Meh.
export function polygonZoom(
  polygon: number[][],
  width: number,
  height: number,
  margin: number = 0
): number {
  function latRad(lat: number): number {
    return (Math.PI * lat) / 180;
  }

  function zoom(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    width: number,
    height: number,
    margin: number = 0
  ): number {
    //const TILE_SIZE: number = 256;
    const TILE_SIZE: number = 1;
    const latDelta: number = latRad(lat1) - latRad(lat2);
    const lonDelta: number = lon1 - lon2;
    const distance: number = Math.max(Math.abs(latDelta), Math.abs(lonDelta));
    const zoomMax: number = 21;

    for (let zoomLevel = zoomMax; zoomLevel > 0; zoomLevel--) {
      if (
        distance * TILE_SIZE * Math.pow(2, zoomLevel) <
        Math.max(width, height) - 2 * margin
      ) {
        return zoomLevel;
      }
    }
    return zoomMax;
  }

  let minLat: number = Infinity;
  let maxLat: number = -Infinity;
  let minLon: number = Infinity;
  let maxLon: number = -Infinity;

  for (const point of polygon) {
    const [lon, lat] = point;
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLon = Math.min(minLon, lon);
    maxLon = Math.max(maxLon, lon);
  }

  return zoom(maxLat, minLon, minLat, maxLon, width, height, margin);
}
