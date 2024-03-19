import { describe, expect, it } from 'vitest';
import { nextFrame, renderHook } from '../test/render';
import { VariableProperty } from '../utils';
import { useProperty } from '.';

describe('useProperty', () => {
  describe('when passed a variable property', () => {
    it('returns the same object', () => {
      const property = new VariableProperty(42);
      const { result } = renderHook(() => useProperty(property));
      expect(result.current).toBe(property);
    });
  });

  describe('when passed something that looks like a property', () => {
    it('returns the same object', () => {
      const property = { current: 42, invalidated: false };
      const { result } = renderHook(() => useProperty(property));
      expect(result.current).toBe(property);
    });
  });

  describe('when passed a literal', () => {
    it('coalesces it into a property', () => {
      const { result } = renderHook(() => useProperty(42));
      expect(result.current.current).toBe(42);
      expect(result.current.invalidated).toBe(true);
    });
  });

  describe('when value is changed', () => {
    it('sets the invalidated flag', () => {
      const { result } = renderHook(() => useProperty(42));
      result.current.invalidated = false;
      
      nextFrame();
      expect(result.current.invalidated).toBe(false);

      result.current.current = 43;
      expect(result.current.invalidated).toBe(true);
    });
  });
});
