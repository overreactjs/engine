import React, { MutableRefObject, useCallback, useEffect, useMemo, useRef } from "react";
import { PointerContext } from "../context";
import { useProperty, useTicker } from "../hooks";
import { Position } from "../types";

type PointerProps = {
  children: React.ReactNode;
}

/**
 * Pointer
 * -----
 * 
 * ...
 */
export const Pointer: React.FC<PointerProps> = ({ children }) => {
  const down = useRef<Set<number>>(new Set());
  const _pressed = useRef<Set<number>>(new Set());
  const pressed = useRef<Set<number>>(new Set());
  const pos = useProperty<Position>([0, 0]);
  const target = useRef<Element | null>(null);

  /**
   * Returns true if the given mouse button is down.
   */
  const isDown = useCallback(() => {
    return down.current.has(0);
  }, []);

  /**
   * Returns true if the given mouse button was *just* released.
   */
  const isPressed = useCallback(() => {
    return pressed.current.has(0);
  }, []);

  /**
   * 
   */
  const isTarget = useCallback((element: MutableRefObject<Element | null> | Element | null) => {
    if (element !== null) {
      if ('current' in element) {
        return element.current !== null && element.current.contains(target.current);
      } else {
        return element.contains(target.current);
      }
    }
    return false;
  }, [target]);

  /**
   * Keep track of which buttons are pressed down.
   */
  const handlePointerDown = useCallback((event: PointerEvent) => {
    pos.current = [event.clientX, event.clientY];
    target.current = event.target as Element;
    down.current.add(0);
  }, [pos]);

  /**
   * Keep track of which buttons have just been released.
   */
  const handlePointerUp = useCallback(() => {
    down.current.delete(0);
    _pressed.current.add(0);
  }, []);

  /**
   * Track the current screen position of the mouse.
   */
  const handlePointerMove = useCallback((event: PointerEvent) => {
    pos.current = [event.clientX, event.clientY];
  }, [pos]);

  /**
   * Ensure that the 'pressed' state is in place for exactly one frame, and no more.
   */
  useTicker(() => {
    if (_pressed.current.has(0) && !pressed.current.has(0)) {
      pressed.current.add(0);
      _pressed.current.delete(0);
    } else if (!_pressed.current.has(0) && pressed.current.has(0)) {
      pressed.current.delete(0);
    }
  })

  /**
   * Attach key event handlers to the window, to capture all events.
   */
  useEffect(() => {
    addEventListener('pointerdown', handlePointerDown);
    addEventListener('pointerup', handlePointerUp);
    addEventListener('pointermove', handlePointerMove);

    return () => {
      removeEventListener('pointerdown', handlePointerDown);
      removeEventListener('pointerup', handlePointerUp);
      removeEventListener('pointermove', handlePointerMove);
    };
  }, [handlePointerDown, handlePointerUp, handlePointerMove]);

  const context = useMemo(
    () => ({ pos, isDown, isPressed, isTarget }),
    [pos, isDown, isPressed, isTarget],
  );

  return (
    <PointerContext.Provider value={context}>
      {children}
    </PointerContext.Provider>
  );
};
