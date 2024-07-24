import React, { useRef, useCallback, useEffect, useMemo, useContext } from "react";
import { EngineContext, KeyboardContext } from "../context";
import { useTicker } from "../hooks";
import { KeyboardKeyName } from "../types";

type KeyboardProps = {
  children: React.ReactNode;
}

/**
 * Keyboard
 * --------
 * 
 * 
 */
export const Keyboard: React.FC<KeyboardProps> = ({ children }) => {
  const { onPause, onDebug } = useContext(EngineContext);
  const down = useRef<Set<string>>(new Set());
  const pressed = useRef<Set<string>>(new Set());
  const _pressed = useRef<Set<string>>(new Set());

  /**
   * Return true if the given key is being held down.
   */
  const isKeyDown = useCallback((code: KeyboardKeyName) => {
    return down.current.has(code);
  }, []);

  /**
   * Return true if the given key was pressed (down and up).
   */
  const isKeyPressed = useCallback((code: KeyboardKeyName) => {
    return pressed.current.has(code);
  }, []);

  /**
   * Returns a value between -1 and +1, based on whether the negative and position keys are
   * currently being pressed.
   */
  const hasKeyAxis = useCallback((negative: KeyboardKeyName, positive: KeyboardKeyName) => {
    return +isKeyDown(positive) - +isKeyDown(negative);
  }, [isKeyDown]);

  /**
   * Simulate the press of a key.
   */
  const simulateKeyDown = useCallback((code: KeyboardKeyName) => {
    dispatchEvent(new KeyboardEvent('keydown', { code }));
  }, []);

  /**
   * Simulate the release of a key.
   */
  const simulateKeyUp = useCallback((code: KeyboardKeyName) => {
    dispatchEvent(new KeyboardEvent('keyup', { code }));
  }, []);

  /**
   * When a key is pressed down, add it to the 'down' list.
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    down.current.add(event.code);
  }, []);

  /**
   * When a key is released, remove it from the 'down' list, and add it to the 'pressed' list, but
   * only for one animation frame, allowing components to check whether a key was just pressed.
   */
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    down.current.delete(event.code);
    _pressed.current.add(event.code);
  }, []);

  /**
   * Ensure that the 'pressed' state is in place for exactly one frame, and no more.
   */
  useTicker(() => {
    for (const code of pressed.current) {
      pressed.current.delete(code);
    }

    for (const code of _pressed.current) {
      pressed.current.add(code);
      _pressed.current.delete(code);
    }
  });

  /**
   * Attach key event handlers to the window, to capture all events.
   */
  useEffect(() => {
    addEventListener('keydown', handleKeyDown);
    addEventListener('keyup', handleKeyUp);

    return () => {
      removeEventListener('keydown', handleKeyDown);
      removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  /**
   * Toggle pause, and toggle debug mode.
   */
  useTicker(() => {
    if (isKeyPressed('Digit2')) {
      onPause();
    }
    if (isKeyPressed('Digit1')) {
      onDebug();
    }
  });

  const context = useMemo(
    () => ({ isKeyDown, isKeyPressed, hasKeyAxis, simulateKeyDown, simulateKeyUp }),
    [isKeyDown, isKeyPressed, hasKeyAxis, simulateKeyDown, simulateKeyUp]
  );

  return (
    <KeyboardContext.Provider value={context}>
      {children}
    </KeyboardContext.Provider>
  );
};
