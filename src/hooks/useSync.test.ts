import { describe, expect, it } from 'vitest';
import { nextFrame, renderHook } from '../test';
import { VariableProperty } from '../utils';
import { useSync } from "./useSync";

describe('useSync', () => {
  describe('when the value changes', () => {
    it('updates the state', () => {
      const property = new VariableProperty(42);
      const { result, rerender } = renderHook(() => useSync(() => property.current));

      expect(result.current).toBe(42);
      expect(property.current).toBe(42);

      property.current = 43;

      rerender();
      expect(result.current).toBe(42);

      nextFrame();
      rerender();
      expect(result.current).toBe(43);
    });
  });
});
