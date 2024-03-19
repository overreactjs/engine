import { describe, expect, it, vi } from 'vitest';
import { nextFrame, renderHook } from '../test/render';
import { VariableProperty } from '../utils';
import { useCachedDynamicProperty, useDynamicProperty } from "./useDynamicProperty";

describe('useDynamicProperty', () => {
  it('calculates the dynamic property value', () => {
    const property = new VariableProperty(42);
    const callback = vi.fn().mockImplementation((value: number) => value + 10);
    const { result } = renderHook(() => useDynamicProperty(property, callback));

    expect(result.current.current).toBe(52);
    expect(callback).toHaveBeenCalledTimes(1);

    property.current = 52;
    expect(result.current.current).toBe(62);
    expect(callback).toHaveBeenCalledTimes(2);

    property.current = 42;
    expect(result.current.current).toBe(52);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('inherits the invalidated flag', () => {
    const property = new VariableProperty(42);
    const callback = vi.fn().mockImplementation((value: number) => value + 10);
    const { result } = renderHook(() => useDynamicProperty(property, callback));

    expect(result.current.invalidated).toBe(true);

    property.invalidated = false;
    nextFrame();
    expect(result.current.invalidated).toBe(false);
  });

  it('sets the invalidated flag upstream', () => {
    const property = new VariableProperty(42);
    const callback = vi.fn().mockImplementation((value: number) => value + 10);
    const { result } = renderHook(() => useDynamicProperty(property, callback));

    expect(result.current.invalidated).toBe(true);

    result.current.invalidated = false;
    nextFrame();
    expect(property.invalidated).toBe(false);
  });
});

describe('useCachedDynamicProperty', () => {
  it('calculates the dynamic property value', () => {
    const property = new VariableProperty(42);
    const callback = vi.fn().mockImplementation((value: number) => value + 10);
    const { result } = renderHook(() => useCachedDynamicProperty(property, callback));

    expect(result.current.current).toBe(52);
    expect(callback).toHaveBeenCalledTimes(1);

    property.current = 52;
    expect(result.current.current).toBe(62);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('does not recalculate a cached value', () => {
    const property = new VariableProperty(42);
    const callback = vi.fn().mockImplementation((value: number) => value + 10);
    const { result } = renderHook(() => useCachedDynamicProperty(property, callback));

    expect(result.current.current).toBe(52);
    expect(callback).toHaveBeenCalledTimes(1);

    property.current = 52;
    expect(result.current.current).toBe(62);
    expect(callback).toHaveBeenCalledTimes(2);

    property.current = 42;
    expect(result.current.current).toBe(52);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
