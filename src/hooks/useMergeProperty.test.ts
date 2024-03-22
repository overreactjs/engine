import { describe, expect, it, vi } from 'vitest';
import { nextFrame, renderHook } from '../test';
import { VariableProperty } from '../utils';
import { useMergeProperty } from "./useMergeProperty";

describe('useMergeProperty', () => {
  it('calculates a value from the two upstream properties', () => {
    const a = new VariableProperty(42);
    const b = new VariableProperty(20);
    const callback = vi.fn().mockImplementation((a: number, b: number) => a + b);
    const { result } = renderHook(() => useMergeProperty(a, b, callback));

    expect(result.current.current).toBe(62);
    expect(callback).toHaveBeenCalledTimes(1);

    a.current = 52;
    expect(result.current.current).toBe(72);
    expect(callback).toHaveBeenCalledTimes(2);

    b.current = 10;
    expect(result.current.current).toBe(62);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('inherits the invalidated flag', () => {
    const a = new VariableProperty(42);
    const b = new VariableProperty(10);
    const callback = vi.fn().mockImplementation((a: number, b: number) => a + b);
    const { result } = renderHook(() => useMergeProperty(a, b, callback));

    expect(result.current.invalidated).toBe(true);

    a.invalidated = false;
    b.invalidated = false;
    nextFrame();
    expect(result.current.invalidated).toBe(false);
  });

  it('sets the invalidated flag upstream', () => {
    const a = new VariableProperty(42);
    const b = new VariableProperty(10);
    const callback = vi.fn().mockImplementation((a: number, b: number) => a + b);
    const { result } = renderHook(() => useMergeProperty(a, b, callback));

    expect(result.current.invalidated).toBe(true);

    result.current.invalidated = false;
    nextFrame();
    expect(a.invalidated).toBe(false);
    expect(b.invalidated).toBe(false);
  });
});
