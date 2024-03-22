import { describe, expect, it } from 'vitest';
import { nextFrame, renderHook } from '../test';
import { useKeyboard } from "./useKeyboard";

describe('useKeyboard', () => {
  describe('isKeyDown', () => {
    describe('when the key is not held down', () => {
      it ('returns false', () => {
        const { result } = renderHook(() => useKeyboard());
        const { isKeyDown } = result.current;
  
        expect(isKeyDown('KeyA')).toBe(false);
      });
    });

    describe('when the key is held down', () => {
      it ('returns true', () => {
        const { result } = renderHook(() => useKeyboard());
        const { isKeyDown, simulateKeyDown } = result.current;
        
        simulateKeyDown('KeyA');
        expect(isKeyDown('KeyA')).toBe(true);
      });
    });

    describe('when the key is released', () => {
      it ('returns false', () => {
        const { result } = renderHook(() => useKeyboard());
        const { isKeyDown, simulateKeyDown, simulateKeyUp } = result.current;
        
        simulateKeyDown('KeyA');
        expect(isKeyDown('KeyA')).toBe(true);
        
        simulateKeyUp('KeyA');
        expect(isKeyDown('KeyA')).toBe(false);
      });
    });
  });

  describe('isKeyPressed', () => {
    describe('when the key is not held down', () => {
      it ('returns false', () => {
        const { result } = renderHook(() => useKeyboard());
        const { isKeyPressed } = result.current;
  
        expect(isKeyPressed('KeyA')).toBe(false);
      });
    });

    describe('when the key is held down', () => {
      it ('returns false', () => {
        const { result } = renderHook(() => useKeyboard());
        const { isKeyPressed, simulateKeyDown } = result.current;
        
        simulateKeyDown('KeyA');
        expect(isKeyPressed('KeyA')).toBe(false);
      });
    });

    describe('when the key is released', () => {
      it ('returns true for exactly one frame', () => {
        const { result } = renderHook(() => useKeyboard());
        const { isKeyPressed, simulateKeyDown, simulateKeyUp } = result.current;
        
        simulateKeyDown('KeyA');
        expect(isKeyPressed('KeyA')).toBe(false);
        
        simulateKeyUp('KeyA');
        expect(isKeyPressed('KeyA')).toBe(false);

        nextFrame();
        expect(isKeyPressed('KeyA')).toBe(true);

        nextFrame();
        expect(isKeyPressed('KeyA')).toBe(false);
      });
    });
  });

  describe('hasKeyAxis', () => {
    describe('when neither keys are down', () => {
      it('returns zero', () => {
        const { result } = renderHook(() => useKeyboard());
        const { hasKeyAxis } = result.current;

        expect(hasKeyAxis('KeyA', 'KeyD')).toBe(0);
      });
    });

    describe('when only the negative key is down', () => {
      it ('returns -1', () => {
        const { result } = renderHook(() => useKeyboard());
        const { hasKeyAxis, simulateKeyDown, simulateKeyUp } = result.current;

        simulateKeyDown('KeyA');
        expect(hasKeyAxis('KeyA', 'KeyD')).toBe(-1);

        simulateKeyUp('KeyA');
        expect(hasKeyAxis('KeyA', 'KeyD')).toBe(0);
      });
    });

    describe('when only the postive key is down', () => {
      it ('returns +1', () => {
        const { result } = renderHook(() => useKeyboard());
        const { hasKeyAxis, simulateKeyDown, simulateKeyUp } = result.current;

        simulateKeyDown('KeyD');
        expect(hasKeyAxis('KeyA', 'KeyD')).toBe(1);

        simulateKeyUp('KeyD');
        expect(hasKeyAxis('KeyA', 'KeyD')).toBe(0);
      });
    });

    describe('when both keys are down', () => {
      it ('returns zero', () => {
        const { result } = renderHook(() => useKeyboard());
        const { hasKeyAxis, simulateKeyDown } = result.current;

        simulateKeyDown('KeyA');
        simulateKeyDown('KeyD');
        expect(hasKeyAxis('KeyA', 'KeyD')).toBe(0);
      });
    });
  });
});
