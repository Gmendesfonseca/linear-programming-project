export function calculateStats(values: number[]): {
  min: number;
  max: number;
  avg: number;
  std: number;
} {
  if (values.length === 0) return { min: 0, max: 0, avg: 0, std: 0 };

  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  const std = Math.sqrt(
    values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) /
      values.length,
  );

  return { min, max, avg, std };
}
