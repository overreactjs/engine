import { BBox } from "detect-collisions";
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
};

/**
 * Clamp a number to a given range.
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

/**
 * Determine if two rectangular bounding boxes intersect.
 */
export const intersects = (a: BBox, b: BBox): boolean => {
  return a.minX < b.maxX && b.minX < a.maxX && a.minY < b.maxY && b.minY < a.maxY;
};

/**
 * Find all permutations of the given input array.
 */
export function permutator<T>(input: T[]): T[][] {
  const result: T[][] = [];

  const permute = (arr: T[], m: T[] = []) => {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        const curr = arr.slice();
        const next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  }

  permute(input);
  return result;
}
