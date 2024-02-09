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
    sum += (next[0] - current[0]) * (next[1] + current[1]);
  }
  return sum / 2;
}

export function polygonCentroid(polygon: number[][]): any {
  console.log(polygon);
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
  return [cx, cy];
}
