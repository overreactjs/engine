import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MockGamepad, renderHook } from '../test';
import { useGamepad } from "./useGamepad";

describe('useGamepad', () => {
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

  describe('isButtonDown', () => {
    it('returns false by default', () => {
      const { result } = renderHook(() => useGamepad());
      const { isButtonDown } = result.current;
      expect(isButtonDown(0, 'Shoulder_R1')).toBe(false);
    });

    describe('when the button is pressed', () => {
      it('returns true', () => {
        const { result } = renderHook(() => useGamepad());
        const { isButtonDown } = result.current;
        gamepad.simulateButtonDown(5);
        expect(isButtonDown(0, 'Shoulder_R1')).toBe(true);
      });
    });

    describe('when the button is released', () => {
      it('returns true', () => {
        const { result } = renderHook(() => useGamepad());
        const { isButtonDown } = result.current;
        gamepad.simulateButtonDown(5);
        gamepad.simulateButtonUp(5);
        expect(isButtonDown(0, 'Shoulder_R1')).toBe(false);
      });
    });
  });

  describe('getButtonAxis', () => {
    describe('when neither button is pressed', () => {
      it('returns 0', () => {
        const { result } = renderHook(() => useGamepad());
        const { getButtonAxis } = result.current;
        expect(getButtonAxis(0, 'Left', 'Right')).toBe(0);
      });
    });

    describe('when negative button is pressed', () => {
      it('returns -1', () => {
        const { result } = renderHook(() => useGamepad());
        const { getButtonAxis } = result.current;
        gamepad.simulateButtonDown(14);
        expect(getButtonAxis(0, 'Left', 'Right')).toBe(-1);
      });
    });

    describe('when the positive button is pressed', () => {
      it('returns 1', () => {
        const { result } = renderHook(() => useGamepad());
        const { getButtonAxis } = result.current;
        gamepad.simulateButtonDown(15);
        expect(getButtonAxis(0, 'Left', 'Right')).toBe(1);
      });
    });

    describe('when both buttons are pressed', () => {
      it('returns 0', () => {
        const { result } = renderHook(() => useGamepad());
        const { getButtonAxis } = result.current;
        gamepad.simulateButtonDown(14);
        gamepad.simulateButtonDown(15);
        expect(getButtonAxis(0, 'Left', 'Right')).toBe(0);
      });
    });
  });
});
