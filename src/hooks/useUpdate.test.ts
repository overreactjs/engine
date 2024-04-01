import { describe, expect, it, vi } from 'vitest';
import { nextFrame, renderHook, renderHookWithEngine } from '../test';
import { useFixedUpdate, useUpdate, useUpdateAfter } from "./useUpdate";

describe('useUpdate', () => {
  describe('when the engine is not paused', () => {
    it('invokes the callback once per animation frame', () => {
      const callback = vi.fn();
      renderHook(() => useUpdate(callback));

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
    renderHook(() => useUpdate(callback));

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

  it('calls callbacks in registration order', () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    renderHook(() => {
      useUpdate(cb2);
      useUpdate(cb1);
    });

    nextFrame();
    expect(cb1).toHaveBeenCalledOnce();
    expect(cb2).toHaveBeenCalledOnce();
    expect(cb2.mock.invocationCallOrder[0]).toBeLessThan(cb1.mock.invocationCallOrder[0]);
  })
});

describe('useUpdateAfter', () => {
  it('calls callbacks in the specified order, regardless of registration order', () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    const cb3 = vi.fn();

    renderHook(() => {
      useUpdateAfter('2', cb3);
      useUpdateAfter('1', cb2, { id: '2' });
      useUpdate(cb1, { id: '1' });
    });

    nextFrame();
    expect(cb1).toHaveBeenCalledOnce();
    expect(cb2).toHaveBeenCalledOnce();
    expect(cb3).toHaveBeenCalledOnce();
    expect(cb1.mock.invocationCallOrder[0]).toBeLessThan(cb2.mock.invocationCallOrder[0]);
    expect(cb2.mock.invocationCallOrder[0]).toBeLessThan(cb3.mock.invocationCallOrder[0]);
  });

  describe('when a cycle is created', () => {
    it('runs none of the updates, and bails out', () => {
      const cb1 = vi.fn();
      const cb2 = vi.fn();
      const cb3 = vi.fn();
  
      renderHook(() => {
        useUpdateAfter('3', cb1, { id: '1' });
        useUpdateAfter('1', cb2, { id: '2' });
        useUpdateAfter('2', cb3, { id: '3' });
      });

      nextFrame();
      expect(cb1).not.toHaveBeenCalled();
      expect(cb2).not.toHaveBeenCalled();
      expect(cb3).not.toHaveBeenCalled();
    });
  });
});

describe('useFixedUpdate', () => {
  it('calls the callback only after enough time has passed', () => {
    const callback = vi.fn();
    renderHook(() => useFixedUpdate(20, callback));
    expect(callback).toHaveBeenCalledTimes(0);

    nextFrame(); // 15ms
    expect(callback).toHaveBeenCalledTimes(0);

    nextFrame(); // 30ms
    expect(callback).toHaveBeenCalledTimes(0);

    nextFrame(); // 45ms
    expect(callback).toHaveBeenCalledTimes(0);

    nextFrame(); // 60ms
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(50, expect.any(Number));
  });
});
