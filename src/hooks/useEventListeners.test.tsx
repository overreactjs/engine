import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '../test';
import { useEventListeners } from "./useEventListeners";

describe('useEventListeners', () => {
  describe('addEventListener', () => {
    it('adds an new event listener', () => {
      const { result } = renderHook(() => useEventListeners());
      const { addEventListener, fireEvent } = result.current;
      const jump = vi.fn();

      addEventListener('jump', jump);
      expect(jump).not.toHaveBeenCalled();

      fireEvent('jump', undefined);
      expect(jump).toHaveBeenCalledOnce();
    });
  });

  describe('removeEventListener', () => {
    it('removes an new event listener', () => {
      const { result } = renderHook(() => useEventListeners());
      const { addEventListener, removeEventListener, fireEvent } = result.current;
      const jump = vi.fn();

      addEventListener('jump', jump);
      removeEventListener('jump', jump);
      fireEvent('jump', undefined);
      expect(jump).not.toHaveBeenCalled();
    });
  });

  describe('fireEvent', () => {
    it('only calls listeners of the correct type', () => {
      const { result } = renderHook(() => useEventListeners());
      const { addEventListener, fireEvent } = result.current;
      const jump = vi.fn();
      const fall = vi.fn();

      addEventListener('jump', jump);
      addEventListener('fall', fall);

      fireEvent('jump', undefined);
      expect(jump).toHaveBeenCalledOnce();
      expect(fall).not.toHaveBeenCalled();
    });
  });
});
