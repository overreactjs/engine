import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '../test';
import { useLogMount } from "./useLogMount";

describe('useLogMount', () => {
  it('outputs to the console on mount', () => {
    const spy = vi.spyOn(global.console, 'log').mockImplementation(() => {});
    expect(spy).not.toHaveBeenCalled();

    const { unmount } = renderHook(() => useLogMount('testing'));

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenLastCalledWith('testing.mount');

    unmount();
    spy.mockRestore();
  });

  it('outputs to the console on unmount', () => {
    const spy = vi.spyOn(global.console, 'log').mockImplementation(() => {});
    expect(spy).not.toHaveBeenCalled();

    const { unmount } = renderHook(() => useLogMount('testing'));

    unmount();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('testing.unmount');

    spy.mockRestore();
  });
});
