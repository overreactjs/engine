import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { TouchContext } from "../context";
import { useProperty } from "../hooks";
import { Position } from "../types";

type TouchProps = {
  children: React.ReactNode;
}

/**
 * Touch
 * -----
 * 
 * ...
 */
export const Touch: React.FC<TouchProps> = ({ children }) => {
  const down = useRef<Set<Element>>(new Set());
  const pressed = useRef<Set<Element>>(new Set());
  const pos = useProperty<Position>([0, 0]);

  /**
   * Returns true if the given mouse button is down.
   */
  const isDown = useCallback((element: Element) => {
    for (const target of down.current) {
      if (element === target || element.contains(target)) {
        return true;
      }
    }

    return false;
  }, []);

  /**
   * Returns true if the given mouse button was *just* released.
   */
  const isPressed = useCallback((element: Element) => {
    return pressed.current.has(element);
  }, []);

  /**
   * Keep track of which buttons are pressed down.
   */
  const handleTouchStart = useCallback((event: TouchEvent) => {
    pos.current[0] = event.touches[0].clientX;
    pos.current[1] = event.touches[0].clientY;
    down.current.add(event.target as Element);
  }, [pos]);

  /**
   * Keep track of which buttons have just been released.
   */
  const handleTouchEnd = useCallback((event: TouchEvent) => {
    down.current.delete(event.target as Element);
    pressed.current.add(event.target as Element);
    requestAnimationFrame(() => {
      pressed.current.delete(event.target as Element);
    });
  }, []);

  /**
   * Track the current screen position of the mouse.
   */
  const handleTouchMove = useCallback((event: TouchEvent) => {
    pos.current[0] = event.touches[0].clientX;
    pos.current[1] = event.touches[0].clientY;
  }, [pos]);

  /**
   * Attach key event handlers to the window, to capture all events.
   */
  useEffect(() => {
    addEventListener('touchstart', handleTouchStart);
    addEventListener('touchend', handleTouchEnd);
    addEventListener('touchmove', handleTouchMove);

    return () => {
      removeEventListener('touchstart', handleTouchStart);
      removeEventListener('touchend', handleTouchEnd);
      removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const context = useMemo(
    () => ({ pos, isDown, isPressed }),
    [pos, isDown, isPressed],
  );

  return (
    <TouchContext.Provider value={context}>
      {children}
    </TouchContext.Provider>
  );
};
