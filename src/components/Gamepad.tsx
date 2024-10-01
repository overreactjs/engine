import React, { useCallback, useMemo } from "react";
import { GamepadContext } from "../context";
import { GamepadAxisName, GamepadButtonName } from "../types";
import { STANDARD_AXIS_MAPPING, STANDARD_BUTTON_MAPPING, STANDARD_BUTTON_UNMAPPING } from "../constants";

type GamepadProps = {
  children: React.ReactNode;
}

/**
 * Gamepad
 * --------
 */
export const Gamepad: React.FC<GamepadProps> = ({ children }) => {
  /**
   * Dynamic 'property' consisting of a set of all gamepad buttons currently being held down.
   */
  const down = useMemo(() => ({
    get current(): Set<GamepadButtonName> {
      const buttons = new Set<GamepadButtonName>();

      navigator.getGamepads().forEach((gamepad) => {
        gamepad?.buttons.forEach((button, index) => {
          if (button.pressed) {
            buttons.add(STANDARD_BUTTON_UNMAPPING[index]);
          }
        });
      });
      
      return buttons;
    }
  }), []);

  /**
   * Return true if the given button is down for the given gamepad.
   */
  const isButtonDown = useCallback((index: number | null, button: GamepadButtonName): boolean => {
    if (index !== null) {
      const gamepad = navigator.getGamepads()[index];
      const mapping = STANDARD_BUTTON_MAPPING[button];
      return gamepad?.buttons[mapping]?.pressed || false;
    }

    return false;
  }, []);

  /**
   * Returns a value between -1 and +1, based on whether the negative and position buttons are
   * currently being pressed.
   */
  const getButtonAxis = useCallback((index: number | null, negative: GamepadButtonName, positive: GamepadButtonName): number => {
    return +isButtonDown(index, positive) - +isButtonDown(index, negative);
  }, [isButtonDown]);

  /**
   * Returns a value between -1 and +1, representing the position of an analog stick in either
   * the horizontal or vertical dimension.
   */
  const getAnalogAxis = useCallback((index: number | null, axis: GamepadAxisName) => {
    if (index !== null) {
      const gamepad = navigator.getGamepads()[index];
      const mapping = STANDARD_AXIS_MAPPING[axis];
      return gamepad?.axes[mapping] || 0;
    }

    return 0;
  }, []);

  /**
   * Trigger the gamepad rumble for the given duration and magnitude.
   */
  const vibrate = useCallback((index: number | null, duration: number, magnitude = 0.5) => {
    if (index !== null) {
      const gamepad = navigator.getGamepads()[index];

      if (gamepad?.vibrationActuator) {
        gamepad.vibrationActuator.playEffect('dual-rumble', {
          startDelay: 0,
          duration,
          weakMagnitude: magnitude,
          strongMagnitude: magnitude,
        });
      }
    }
  }, []);

  const context = useMemo(
    () => ({ down, isButtonDown, getButtonAxis, getAnalogAxis, vibrate }),
    [down, isButtonDown, getButtonAxis, getAnalogAxis, vibrate]
  );

  return (
    <GamepadContext.Provider value={context}>
      {children}
    </GamepadContext.Provider>
  );
};
