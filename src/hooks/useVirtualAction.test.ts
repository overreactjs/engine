import { describe, expect, it, vi } from 'vitest';
import { nextFrame, renderHook } from '../test';
import { useVirtualInput } from './useVirtualInput';
import { useVirtualAction } from './useVirtualAction';

describe('useVirtualAction', () => {
  describe('when the action is not active', () => {
    it('does not invoke the callback', () => {
      const callback = vi.fn();
      renderHook(() => useVirtualAction('jump', callback));
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('when the action is active', () => {
    it('invokes the callback each frame for 50ms', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => {
        useVirtualAction('jump', callback);
        return useVirtualInput();
      });

      const { simulate } = result.current;

      simulate('jump');
      nextFrame();
      expect(callback).toHaveBeenCalledTimes(1);

      nextFrame();
      expect(callback).toHaveBeenCalledTimes(2);

      nextFrame();
      expect(callback).toHaveBeenCalledTimes(3);

      nextFrame();
      expect(callback).toHaveBeenCalledTimes(3);
    });
  });
});