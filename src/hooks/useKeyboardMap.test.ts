import { describe, expect, it } from 'vitest';
import { nextFrame, renderHook } from '../test';
import { useKeyboard } from "./useKeyboard";
import { useKeyboardMap, useVirtualInput } from '.';

describe('useKeyboardMap', () => {
  const renderSubject = (active?: boolean) => {
    return renderHook(() => {
      useKeyboardMap({ KeyW: 'jump' }, active);
      const keyboard = useKeyboard();
      const input = useVirtualInput();
      return { keyboard, input };
    });
  }

  describe('when a mapped key is pressed', () => {
    it('activates the associated virtual input', () => {
      const { result } = renderSubject();
      const { keyboard, input } = result.current;

      expect(input.isActive('jump')).toBe(false);

      keyboard.simulateKeyDown('KeyW');
      nextFrame();
      expect(input.isActive('jump')).toBe(true);
    });

    describe('but the map is not active', () => {
      it('does not activate the associated virtual input', () => {
        const { result } = renderSubject(false);
        const { keyboard, input } = result.current;
  
        expect(input.isActive('jump')).toBe(false);
  
        keyboard.simulateKeyDown('KeyW');
        nextFrame();
        expect(input.isActive('jump')).toBe(false);
      });
    })
  });
});