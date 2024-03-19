import { describe, expect, it, vi } from 'vitest';
import { nextFrame, renderHookWithEngine } from '../test/render';
import { useTicker } from "./useTicker";

describe('useTicker', () => {
  describe('when the engine is not paused', () => {
    it('invokes the callback once per animation frame', () => {
      const callback = vi.fn();
      renderHookWithEngine(() => useTicker(callback));

      nextFrame();
      expect(callback).toHaveBeenCalled();
      nextFrame();
      expect(callback).toHaveBeenCalled();
      nextFrame();
      expect(callback).toHaveBeenCalled();
    });
  });

  it('receives the frame duration and total time', () => {
    const callback = vi.fn();
    renderHookWithEngine(() => useTicker(callback));

    nextFrame();
    expect(callback).toHaveBeenCalledWith(15, 105);
    nextFrame();
    expect(callback).toHaveBeenCalledWith(15, 120);
    nextFrame();
    expect(callback).toHaveBeenCalledWith(15, 135);
  });

  describe('when the engine is paused', () => {
    it('still invokes the callback once per animation frame', () => {
      const callback = vi.fn();
      const { result } = renderHookWithEngine(() => useTicker(callback));

      result.current.engine.onPause();

      nextFrame();
      expect(callback).toHaveBeenCalled();
      nextFrame();
      expect(callback).toHaveBeenCalled();
      nextFrame();
      expect(callback).toHaveBeenCalled();
    });
  });
});
