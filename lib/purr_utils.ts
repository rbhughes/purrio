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
