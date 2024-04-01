import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MockGamepad, nextFrame, renderHook } from '../test';
import { useGamepadMap } from './useGamepadMap';
import { useVirtualInput } from './useVirtualInput';

describe('useGamepadMap', () => {
  const renderSubject = (active?: boolean) => {
    return renderHook(() => {
      useGamepadMap(0, { Shoulder_R1: 'jump' }, active);
      const input = useVirtualInput();
      return { input };
    });
  }

  let original = navigator.getGamepads;
  let gamepad: MockGamepad;

  beforeEach(() => {
    original = navigator.getGamepads;
    gamepad = new MockGamepad();
    navigator.getGamepads = vi.fn().mockImplementation(() => ([gamepad]));
  });

  afterEach(() => {
    navigator.getGamepads = original;
  });

  describe('when a mapped button is pressed', () => {
    it('activates the associated virtual input', () => {
      const { result } = renderSubject();
      const { input } = result.current;

      expect(input.isActive('jump')).toBe(false);

      gamepad.simulateButtonDown(5);
      nextFrame();
      expect(input.isActive('jump')).toBe(true);
    });

    describe('but the map is not active', () => {
      it('does not activate the associated virtual input', () => {
        const { result } = renderSubject(false);
        const { input } = result.current;
  
        expect(input.isActive('jump')).toBe(false);
  
        gamepad.simulateButtonDown(5);
        nextFrame();
        expect(input.isActive('jump')).toBe(false);
      });
    })
  });
});