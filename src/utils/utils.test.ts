import { describe, expect, it } from 'vitest';
import { clamp, dist, lerp } from './utils';

describe('utils', () => {
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
});