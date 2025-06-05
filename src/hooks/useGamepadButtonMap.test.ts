import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockGamepad, mockGamepads, nextFrame, renderHook, resetGamepads } from '../test';
import { useGamepadButtonMap } from './useGamepadButtonMap';
import { useVirtualInput } from './useVirtualInput';

describe('useGamepadButtonMap', () => {
  const renderSubject = (active?: boolean) => {
    return renderHook(() => {
      useGamepadButtonMap(0, { Shoulder_R1: 'jump' }, active);
      const input = useVirtualInput();
      return { input };
    });
  }

  let gamepad: MockGamepad;

  beforeEach(() => {
    gamepad = mockGamepads();
  });

  afterEach(() => {
    resetGamepads();
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