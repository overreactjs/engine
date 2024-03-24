import { describe, expect, it } from 'vitest';
import { MapSet } from './MapSet';

describe('MapSet', () => {
  it('is initially empty', () => {
    const map = new MapSet<string, string>();
    expect(map.size).toBe(0);
  });

  describe('when the map set does not contain a value', () => {
    it('has() returns false', () => {
      const map = new MapSet<string, string>();
      expect(map.has('a', 'b')).toBe(false);
    });
  });

  describe('when the map set contains a value', () => {
    it('has() returns false', () => {
      const map = new MapSet<string, string>();
      map.add('a', 'b');
      expect(map.has('a', 'b')).toBe(true);
    });
  });

  describe('when a value is removed from the map set', () => {
    it('has() returns false', () => {
      const map = new MapSet<string, string>();
      map.add('a', 'b');
      map.delete('a', 'b');
      expect(map.has('a', 'b')).toBe(false);
    });

    it('reduces the size by 1', () => {
      const map = new MapSet<string, string>();
      map.add('a', 'b');
      map.delete('a', 'b');
      expect(map.size).toBe(0);
    })
  });

  describe('when there is one set', () => {
    describe('and the set contains one value', () => {
      it('has a size of 1', () => {
        const map = new MapSet<string, string>();
        map.add('a', 'b');
        expect(map.size).toBe(1);
      });
    });

    describe('and the set contains two values', () => {
      it('has a size of 2', () => {
        const map = new MapSet<string, string>();
        map.add('a', 'b');
        map.add('a', 'c');
        expect(map.size).toBe(2);
      });
    });
  });

  describe('when there are two sets', () => {
    describe('and each set contains one value', () => {
      it('has a size of 2', () => {
        const map = new MapSet<string, string>();
        map.add('a', 'b');
        map.add('c', 'd');
        expect(map.size).toBe(2);
      });
    });

    describe('and each set contains two values', () => {
      it('has a size of 4', () => {
        const map = new MapSet<string, string>();
        map.add('a', 'b');
        map.add('a', 'c');
        map.add('d', 'e');
        map.add('d', 'f');
        expect(map.size).toBe(4);
      });
    });

    it('can hold the same value in multiple sets', () => {
      const map = new MapSet<string, string>();
      map.add('a', 'c');
      map.add('b', 'c');
      expect(map.size).toBe(2);
    });
  });

  describe('adding a value that already exists', () => {
    it('does not increase the size', () => {
      const map = new MapSet<string, string>();
      map.add('a', 'b');
      map.add('a', 'c');
      expect(map.size).toBe(2);

      map.add('a', 'c');
      expect(map.size).toBe(2);
    });
  });
});
