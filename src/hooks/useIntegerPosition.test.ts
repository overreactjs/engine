import { describe, expect, it } from 'vitest';
import { renderHook } from '../test';
import { Position } from '../types';
import { VariableProperty } from '../utils';
import { useIntegerPosition } from './useIntegerPosition';

describe('useIntegerPosition', () => {
  it('rounds positive values', () => {
    const pos = new VariableProperty<Position>([9.1, 9.5]);
    const { result } = renderHook(() => useIntegerPosition(pos));
    expect(result.current.current).toEqual([9, 10]);
  });

  it('rounds near-zero positive values', () => {
    const pos = new VariableProperty<Position>([0.1, 0.5]);
    const { result } = renderHook(() => useIntegerPosition(pos));
    expect(result.current.current).toEqual([0, 1]);
  });

  it('rounds near-zero negative values', () => {
    const pos = new VariableProperty<Position>([-0.1, -0.5]);
    const { result } = renderHook(() => useIntegerPosition(pos));
    expect(result.current.current).toEqual([-0, -0]);
  });

  it('rounds negative values', () => {
    const pos = new VariableProperty<Position>([-0.9, -9.5]);
    const { result } = renderHook(() => useIntegerPosition(pos));
    expect(result.current.current).toEqual([-1, -9]);
  });
});
