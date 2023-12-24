import { Position } from "../types";

/**
 * Linear interpolation between two numbers, "a" and "b".
 */
export const lerp = (a: number, b: number, t: number): number => {
  return a + t * (b - a);
};

/**
 * Euclidean distance between two points.
 */
export const dist = (a: Position, b: Position): number => {
  const x = a[0] - b[0];
  const y = a[1] - b[1];
  return Math.sqrt((x * x) + (y * y));
}