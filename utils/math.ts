export function standardDeviation(numArray: number[]): number {
  const mean: number =
    numArray.reduce((s: number, n: number) => s + n) / numArray.length;
  const variance: number =
    numArray.reduce((s: number, n: number) => s + Math.pow(n - mean, 2), 0) /
    (numArray.length - 1);
  return Math.sqrt(variance);
}
