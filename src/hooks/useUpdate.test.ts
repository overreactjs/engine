import { describe, expect, it, vi } from 'vitest';
import { nextFrame, renderHookWithEngine } from '../test/render';
import { useUpdate } from "./useUpdate";

describe('useUpdate', () => {
  describe('when the engine is not paused', () => {
    it('invokes the callback once per animation frame', () => {
      const callback = vi.fn();
      renderHookWithEngine(() => useUpdate(callback));

      nextFrame();
      expect(callback).toHaveBeenCalledTimes(1);
      nextFrame();
      expect(callback).toHaveBeenCalledTimes(2);
      nextFrame();
      expect(callback).toHaveBeenCalledTimes(3);
    });
  });

  it('receives the frame duration and total time', () => {
    const callback = vi.fn();
    renderHookWithEngine(() => useUpdate(callback));

    nextFrame();
    expect(callback).toHaveBeenCalledWith(15, 105);
    nextFrame();
    expect(callback).toHaveBeenCalledWith(15, 120);
    nextFrame();
    expect(callback).toHaveBeenCalledWith(15, 135);
  });

  describe('when the engine is paused', () => {
    it('does not invoke the callback', () => {
      const callback = vi.fn();
      const { result } = renderHookWithEngine(() => useUpdate(callback));

      result.current.engine.onPause();
      
      nextFrame();
      expect(callback).not.toHaveBeenCalled();
      nextFrame();
      expect(callback).not.toHaveBeenCalled();
      nextFrame();
      expect(callback).not.toHaveBeenCalled();
    });

    describe('then the engine is unpaused', () => {
      it('begins invoking the callback again', () => {
        const callback = vi.fn();
        const { result } = renderHookWithEngine(() => useUpdate(callback));

        result.current.engine.onPause();
        
        nextFrame();
        expect(callback).not.toHaveBeenCalled();
        nextFrame();
        expect(callback).not.toHaveBeenCalled();

        result.current.engine.onPause();

        nextFrame();
        expect(callback).toHaveBeenCalledTimes(1);
        nextFrame();
        expect(callback).toHaveBeenCalledTimes(2);
      });
    });
  });
});
