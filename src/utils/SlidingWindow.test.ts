import { describe, expect, it } from 'vitest';
import { SlidingWindow } from './SlidingWindow';

describe('SlidingWindow', () => {
  describe('when it it empty', () => {
    it('returns an empty array', () => {
      const window = new SlidingWindow(5);
      expect(window.values).toEqual([]);
    });

    it('returns a mean of zero', () => {
      const window = new SlidingWindow(5);
      expect(window.mean()).toEqual(0);
    });
  });

  describe('when there is unused space', () => {
    it('pushes new values into the unused space', () => {
      const window = new SlidingWindow(5);
      window.push(1);
      window.push(2);
      window.push(3);
      expect(window.values).toEqual([1, 2, 3]);
      expect(window.mean()).toEqual(1.2);
    });
  });

  describe('when there is no unused space', () => {
    it('overrides existing values in a first-in first-out pattern', () => {
      const window = new SlidingWindow(5);
      window.push(1);
      window.push(2);
      window.push(3);
      window.push(4);
      window.push(5);
      expect(window.values).toEqual([1, 2, 3, 4, 5]);

      window.push(6);
      window.push(7);
      window.push(8);
      expect(window.values).toEqual([6, 7, 8, 4, 5]);
      expect(window.mean()).toEqual(6);
    });
  });
});
