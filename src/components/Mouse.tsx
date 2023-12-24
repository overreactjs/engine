import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { MouseContext } from "../context";
import { useProperty } from "../hooks";
import { Position, Property } from "../types";

type MouseProps = {
  children: React.ReactNode;
}

/**
 * Mouse
 * -----
 * 
 * Keep track of the current move position (in screen space) and which buttons are currently 
 * pressed.
 */
export const Mouse: React.FC<MouseProps> = ({ children }) => {
  const down = useRef<Set<number>>(new Set());
  const pressed = useRef<Set<number>>(new Set());
  const pos = useProperty<Position>([0, 0]);
  const target = useProperty<Element | null>(null);

  /**
   * Returns true if the given mouse button is down.
   */
  const isDown = useCallback((button: number) => {
    return down.current.has(button);
  }, []);

  /**
   * Returns true if the given mouse button was *just* released.
   */
  const isPressed = useCallback((button: number) => {
    return pressed.current.has(button);
  }, []);

  /**
   * Returns true if the given element is inside of the current target.
   */
  const isTarget = useCallback((element: Property<Element | null> | Element | null) => {
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
  const handleMouseDown = useCallback((event: MouseEvent) => {
    down.current.add(event.button);
    target.current = event.target as Element;
  }, [target]);

  /**
   * Keep track of which buttons have just been released.
   */
  const handleMouseUp = useCallback((event: MouseEvent) => {
    down.current.delete(event.button);
    pressed.current.add(event.button);
    requestAnimationFrame(() => {
      pressed.current.delete(event.button);
      target.current = null;
    });
  }, [target]);

  /**
   * Track the current screen position of the mouse.
   */
  const handleMouseMove = useCallback((event: MouseEvent) => {
    pos.current[0] = event.clientX;
    pos.current[1] = event.clientY;
  }, [pos]);

  /**
   * Attach key event handlers to the window, to capture all events.
   */
  useEffect(() => {
    addEventListener('mousedown', handleMouseDown);
    addEventListener('mouseup', handleMouseUp);
    addEventListener('mousemove', handleMouseMove);

    return () => {
      removeEventListener('mousedown', handleMouseDown);
      removeEventListener('mouseup', handleMouseUp);
      removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  const context = useMemo(
    () => ({ pos, isDown, isPressed, isTarget }),
    [pos, isDown, isPressed, isTarget],
  );

  return (
    <MouseContext.Provider value={context}>
      {children}
    </MouseContext.Provider>
  );
};
