import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '../test';
import { VariableProperty } from '../utils';
import { usePropertyListen } from './usePropertyListen';

describe('usePropertyListen', () => {
  describe('when a scalar property changes', () => {
    it('calls the listener function', () => {
      const property = new VariableProperty(42);
      const fn = vi.fn();

      renderHook(() => usePropertyListen(property, fn));
      expect(fn).not.toBeCalled();

      property.current = 43;
      expect(fn).toBeCalledTimes(1);
      expect(fn).toBeCalledWith(43);
    });
  });

  describe('when an array property changes', () => {
    it('calls the listener function', () => {
      const property = new VariableProperty(['a', 'b']);
      const fn = vi.fn();

      renderHook(() => usePropertyListen(property, fn));
      expect(fn).not.toBeCalled();

      property.current = ['c', 'd'];
      expect(fn).toBeCalledTimes(1);
      expect(fn).toBeCalledWith(['c', 'd']);
    });
  });

  describe('when an entry in an array property changes', () => {
    it('calls the listener function', () => {
      const property = new VariableProperty(['a', 'b']);
      const fn = vi.fn();

      renderHook(() => usePropertyListen(property, fn));
      expect(fn).not.toBeCalled();

      property.current[0] = 'c';
      expect(fn).toBeCalledTimes(1);
      expect(fn).toBeCalledWith(['c', 'b']);
    });
  });
});
