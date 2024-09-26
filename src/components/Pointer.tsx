import React, { MutableRefObject, useCallback, useEffect, useMemo, useRef } from "react";
import { PointerContext } from "../context";
import { useProperty, useTicker, useUpdate } from "../hooks";
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
  const targets = useRef<Map<number, Element>>(new Map());
  const positions = useRef<Map<number, Position>>(new Map());
  const pos = useProperty<Position>([0, 0]);

  useUpdate(() => {
    const total: Position = [0, 0];
    for (const position of positions.current) {
      total[0] += position[1][0];
      total[1] += position[1][1];
    }
    
    pos.current = [total[0] / positions.current.size, total[1] / positions.current.size];
  });

  /**
   * Returns true if the given mouse button is down.
   */
  const isDown = useCallback(() => {
    return down.current.size > 0;
  }, []);

  /**
   * Returns true if the given mouse button was *just* released.
   */
  const isPressed = useCallback(() => {
    return pressed.current.size > 0;
  }, []);

  /**
   * 
   */
  const isTarget = useCallback((element: MutableRefObject<Element | null> | Element | null) => {
    const contains = (element: Element): boolean => {
      for (const target of targets.current.values()) {
        if (element.contains(target)) {
          return true;
        }
      }

      return false;
    };

    if (element !== null) {
      if ('current' in element) {
        return element.current !== null && contains(element.current);
      } else {
        return contains(element);
      }
    }
    
    return false;
  }, [targets]);

  /**
   * Keep track of which buttons are pressed down.
   */
  const handlePointerDown = useCallback((event: PointerEvent) => {
    positions.current.set(event.pointerId, [event.clientX, event.clientY]);
    targets.current.set(event.pointerId, event.target as Element);
    down.current.add(event.pointerId);
  }, []);

  /**
   * Keep track of which buttons have just been released.
   */
  const handlePointerUp = useCallback((event: PointerEvent) => {
    down.current.delete(event.pointerId);
    _pressed.current.add(event.pointerId);
  }, []);

  /**
   * Track the current screen position of the mouse.
   */
  const handlePointerMove = useCallback((event: PointerEvent) => {
    positions.current.set(event.pointerId, [event.clientX, event.clientY]);
  }, []);

  /**
   * Ensure that the 'pressed' state is in place for exactly one frame, and no more.
   */
  useTicker(() => {
    for (const id of pressed.current) {
      if (!_pressed.current.has(id)) {
        pressed.current.delete(id);
        positions.current.delete(id);
        targets.current.delete(id);
      }
    }

    for (const id of _pressed.current) {
      if (!pressed.current.has(id)) {
        pressed.current.add(id);
        _pressed.current.delete(id);
      }
    }
  });

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
