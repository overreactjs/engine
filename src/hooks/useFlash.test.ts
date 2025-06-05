import { describe, expect, it } from 'vitest';
import { nextFrame, renderHook } from '../test';
import { useFlash } from './useFlash';

describe('useFlash', () => {
  it('alternates between true and false', () => {
    const value = renderHook(() => useFlash(30)).result.current;
    expect(value.current).toBe(true);

    nextFrame();
    expect(value.current).toBe(true);

    nextFrame();
    expect(value.current).toBe(false);

    nextFrame();
    expect(value.current).toBe(false);

    nextFrame();
    expect(value.current).toBe(true);
  });
});
