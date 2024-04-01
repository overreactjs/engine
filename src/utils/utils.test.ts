import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { chance, clamp, dist, intersects, lerp, permutator } from './utils';

describe('utils', () => {
  describe('chance', () => {
    let original: () => number;

    beforeEach(() => {
      original = Math.random;
      Math.random = () => 0.01;
    });

    afterEach(() => {
      Math.random = original;
    });

    describe('when the random value is less than the threshold', () => {
      it('returns true', () =>{
        expect(chance(20)).toBe(true);
      });
    });

    describe('when the random value is greater than the threshold', () => {
      it('returns false', () =>{
        expect(chance(19)).toBe(false);
      });
    });
  });

  describe('lerp', () => {
    it('linearly interpolates between two values', () => {
      expect(lerp(0, 10, 0.5)).toBe(5);
    });
  });

  describe('dist', () => {
    it('calculates the euclidean distance between two points', () => {
      expect(dist([0, 0], [40, 30])).toBe(50)
    });
  });

  describe('clamp', () => {
    describe('when the value is within the range', () => {
      it('returns the value', () => {
        expect(clamp(15, 10, 20)).toBe(15);
      });
    });

    describe('when the value less than the range', () => {
      it('returns the min value', () => {
        expect(clamp(5, 10, 20)).toBe(10);
      });
    });
    
    describe('when the value is greater than the range', () => {
      it('returns the max value', () => {
        expect(clamp(25, 10, 20)).toBe(20);
      });
    });
  });

  describe('intersects', () => {
    describe('when the two bounding boxes intersect', () => {
      it('returns true', () => {
        const a = { minX: 0, minY: 0, maxX: 100, maxY: 100 };
        const b = { minX: 50, minY: 50, maxX: 150, maxY: 150 };
        expect(intersects(a, b)).toBe(true);
      });
    });

    describe('when the two bounding boxes do not intersect', () => {
      it('returns false', () => {
        const a = { minX: 0, minY: 0, maxX: 100, maxY: 100 };
        const b = { minX: 101, minY: 101, maxX: 150, maxY: 150 };
        expect(intersects(a, b)).toBe(false);
      });
    });

    describe('when the two bounding boxes are touching but not overlapping', () => {
      it('returns false', () => {
        const a = { minX: 0, minY: 0, maxX: 100, maxY: 100 };
        const b = { minX: 100, minY: 100, maxX: 150, maxY: 150 };
        expect(intersects(a, b)).toBe(false);
      });
    });
  });

  describe('permutator', () => {
    it('returns all possible permutations of the input array', () => {
      expect(permutator([1, 2, 3])).toEqual([
        [1, 2, 3],
        [1, 3, 2],
        [2, 1, 3],
        [2, 3, 1],
        [3, 1, 2],
        [3, 2, 1],
      ]);
    });
  })
});