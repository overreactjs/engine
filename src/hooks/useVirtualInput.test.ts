import { describe, expect, it } from 'vitest';
import { nextFrame, renderHook } from '../test';
import { useVirtualInput } from './useVirtualInput';

describe('useVirtualInput', () => {
  describe('isActive', () => {
    describe('when the input is not active', () => {
      it ('returns false', () => {
        const { result } = renderHook(() => useVirtualInput());
        const { isActive } = result.current;
  
        expect(isActive('jump')).toBe(false);
      });
    });

    describe('when the input is activated', () => {
      it ('returns true', () => {
        const { result } = renderHook(() => useVirtualInput());
        const { isActive, simulate } = result.current;
        
        simulate('jump');
        expect(isActive('jump')).toBe(true);
      });

      it('remains true for 50ms', () => {
        const { result } = renderHook(() => useVirtualInput());
        const { isActive, simulate } = result.current;
        
        simulate('jump');
        expect(isActive('jump')).toBe(true);

        nextFrame(); // 15ms
        expect(isActive('jump')).toBe(true);
        
        nextFrame(); // 30ms
        expect(isActive('jump')).toBe(true);
        
        nextFrame(); // 45ms
        expect(isActive('jump')).toBe(true);
        
        nextFrame(); // 60ms
        expect(isActive('jump')).toBe(false);
      });
    });
  });

  describe('hasAxis', () => {
    describe('when neither axis is set', () => {
      it('returns 0', () => {
        const { result } = renderHook(() => useVirtualInput());
        const { hasAxis } = result.current;

        expect(hasAxis('left', 'right')).toBe(0);
      });
    });

    describe('when only the negative axis is set', () => {
      it('returns -1', () => {
        const { result } = renderHook(() => useVirtualInput());
        const { hasAxis, simulate } = result.current;

        simulate('left');
        expect(hasAxis('left', 'right')).toBe(-1);
      });
    });

    describe('when only the postive axis is set', () => {
      it('returns 1', () => {
        const { result } = renderHook(() => useVirtualInput());
        const { hasAxis, simulate } = result.current;

        simulate('right');
        expect(hasAxis('left', 'right')).toBe(1);
      });
    });

    describe('when both axis is set', () => {
      it('returns 0', () => {
        const { result } = renderHook(() => useVirtualInput());
        const { hasAxis, simulate } = result.current;

        simulate('left');
        simulate('right');
        expect(hasAxis('left', 'right')).toBe(0);
      });
    });
  });
});