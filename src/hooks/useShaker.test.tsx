import { describe, expect, it } from 'vitest';
import { nextFrame, render, renderHook } from '../test';
import { useShaker } from './useShaker';

describe('useShaker', () => {
  it('defaults to no movement', () => {
    const shaker = renderHook(() => useShaker()).result.current;
    render(<div ref={shaker.ref} />);

    expect(shaker.ref.current?.style.transform).toBe('translate(0px, 0px)');
  });

  describe('when the shake function is called', () => {
    it('shakes the element side to side', () => {
      const shaker = renderHook(() => useShaker({ phase: 100 })).result.current;
      render(<div ref={shaker.ref} />);

      shaker.shake();

      expectElementToShake(shaker.ref.current, [45.7, 31.9, 16.4, 0.8, -13.4, -25.1, -33.4]);
    });
  });

  describe('when the strength is increased', () => {
    it('increases the shake amount', () => {
      const shaker = renderHook(() => useShaker({ phase: 100, strength: 80 })).result.current;
      render(<div ref={shaker.ref} />);

      shaker.shake();

      expectElementToShake(shaker.ref.current, [91.4, 63.9, 32.9, 1.7, -26.8, -50.2]);
    });
  });

  describe('when the phase is reduced', () => {
    it('shakes the element faster', () => {
      const shaker = renderHook(() => useShaker({ phase: 15 })).result.current;
      render(<div ref={shaker.ref} />);

      shaker.shake();

      expectElementToShake(shaker.ref.current, [-44.3, 49.8, 0.9, -46.2, 35.8, 13.5]);
    });
  });
});

/**
 * Run through a number of frames, building up an array of actual translate values, then compare
 * it to the expected translate amounts.
 */
const expectElementToShake = (element: HTMLElement | null, expected: number[]) => {
  const actual = [];

  while (actual.length < expected.length) {
    nextFrame();
    actual.push(parseFloat((element?.style.transform || '').match(/translate\((.+?)px/)?.[1] || 'NaN').toFixed(1));
  }

  expect(actual).toEqual(expected.map((value) => value.toFixed(1)));
}