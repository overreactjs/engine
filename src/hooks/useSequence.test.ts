import { describe, expect, it, vi } from 'vitest';
import { nextFrame, renderHook } from '../test/render';
import { useSequence } from "./useSequence";

describe('useSequence', () => {
  describe('when all of the conditions have been met, in order', () => {
    it ('invokes the callback', () => {
      const callback = vi.fn();
      const data = { a: false, b: false };
      renderHook(() => useSequence([() => data.a, () => data.b], callback));

      expect(callback).not.toHaveBeenCalled();

      data.a = true;
      nextFrame();
      expect(callback).not.toHaveBeenCalled();

      data.b = true;
      nextFrame();
      expect(callback).toHaveBeenCalled();
    });

    it ('resets the sequence afterwards', () => {
      const callback = vi.fn();
      const data = { a: false, b: false };
      renderHook(() => useSequence([() => data.a, () => data.b], callback));

      expect(callback).not.toHaveBeenCalled();

      data.a = true;
      nextFrame();
      expect(callback).not.toHaveBeenCalled();

      data.b = true;
      nextFrame();
      expect(callback).toHaveBeenCalled();

      nextFrame();
      expect(callback).toHaveBeenCalledTimes(1);
    })
  });

  describe('when all of the conditions have been met, out of order', () => {
    it ('does not invoke the callback', () => {
      const callback = vi.fn();
      const data = { a: false, b: false };
      renderHook(() => useSequence([() => data.a, () => data.b], callback));

      expect(callback).not.toHaveBeenCalled();

      data.b = true;
      nextFrame();
      expect(callback).not.toHaveBeenCalled();

      data.a = true;
      nextFrame();
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
