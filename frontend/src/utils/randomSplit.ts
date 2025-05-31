export function randomSplitInt(total: number, parts: number): number[] {
  if (parts <= 1) return [total];
  // Generate n-1 random breakpoints
  const points = Array.from(
    { length: parts - 1 },
    () => Math.floor(Math.random() * (total - 1)) + 1
  );
  points.push(0, total);
  points.sort((a, b) => a - b);
  // Calculate differences between consecutive points
  const result = [];
  for (let i = 0; i < parts; i++) {
    result.push(points[i + 1] - points[i]);
  }
  return result;
}
