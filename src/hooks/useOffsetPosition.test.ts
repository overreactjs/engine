import { describe, expect, it } from 'vitest';
import { nextFrame, renderHook } from '../test';
import { Position } from '../types';
import { VariableProperty } from '../utils';
import { useOffsetPosition } from './useOffsetPosition';

describe('useOffsetPosition', () => {
  describe('when offset is not a property', () => {
    it('combines the position and offset', () => {
      const pos = new VariableProperty<Position>([100, 50]);
      const offset: Position = [10, 20];
      const { result } = renderHook(() => useOffsetPosition(pos, offset));
      expect(result.current.current).toEqual([110, 70]);

      pos.current = [300, 200];
      expect(result.current.current).toEqual([310, 220]);
    });
  });

  describe('when offset is a property', () => {
    it('combines the position and offset', () => {
      const pos = new VariableProperty<Position>([100, 50]);
      const offset = new VariableProperty<Position>([10, 20]);
      const { result } = renderHook(() => useOffsetPosition(pos, offset));
      expect(result.current.current).toEqual([110, 70]);

      pos.current = [300, 200];
      expect(result.current.current).toEqual([310, 220]);

      offset.current = [40, 50];
      expect(result.current.current).toEqual([340, 250]);
    });

    it('combines the child invalidated flags', () => {
      const pos = new VariableProperty<Position>([100, 50]);
      const offset = new VariableProperty<Position>([10, 20]);
      const { result } = renderHook(() => useOffsetPosition(pos, offset));
      expect(result.current.invalidated).toBe(true);

      pos.invalidated = false;
      nextFrame();
      expect(result.current.invalidated).toBe(true);

      offset.invalidated = false;
      nextFrame();
      expect(result.current.invalidated).toBe(false);

      pos.invalidated = true;
      offset.invalidated = true;
      nextFrame();
      expect(result.current.invalidated).toBe(true);

      offset.invalidated = false;
      nextFrame();
      expect(result.current.invalidated).toBe(true);

      pos.invalidated = false;
      nextFrame();
      expect(result.current.invalidated).toBe(false);
    });
  });
});
