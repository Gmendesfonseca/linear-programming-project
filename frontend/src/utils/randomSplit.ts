export function randomSplitInt(total: number, parts: number): number[] {
  if (parts <= 1) return [total];
  const set = new Set<number>();
  while (set.size < parts - 1) {
    set.add(Math.floor(Math.random() * (total - 1)) + 1);
  }
  const points = Array.from(set);
  points.push(0, total);
  points.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < parts; i++) {
    result.push(points[i + 1] - points[i]);
  }
  return result;
}
