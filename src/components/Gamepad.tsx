import React, { useCallback, useMemo } from "react";
import { GamepadContext } from "../context";
import { GamepadAxisName, GamepadButtonName } from "../types";

export const STANDARD_BUTTON_MAPPING: Record<GamepadButtonName, number> = {
  Up: 12,
  Down: 13,
  Left: 14,
  Right: 15,
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  Shoulder_L1: 4,
  Shoulder_L2: 6,
  Shoulder_R1: 5,
  Shoulder_R2: 7,
  Start: 8,
  Select: 9,
};

export const STANDARD_AXIS_MAPPING: Record<GamepadAxisName, number> = {
  Left_Horizontal: 0,
  Left_Vertical: 1,
  Right_Horizontal: 2,
  Right_Vertical: 3,
};

type GamepadProps = {
  children: React.ReactNode;
}

/**
 * Gamepad
 * --------
 */
export const Gamepad: React.FC<GamepadProps> = ({ children }) => {
  const isButtonDown = useCallback((index: number, button: GamepadButtonName) => {
    return navigator.getGamepads()[index]?.buttons[STANDARD_BUTTON_MAPPING[button]].pressed || false;
  }, []);

  const getButtonAxis = useCallback((index: number, negative: GamepadButtonName, positive: GamepadButtonName) => {
    return +isButtonDown(index, positive) - +isButtonDown(index, negative);
  }, [isButtonDown]);

  const getAnalogAxis = useCallback((index: number, axis: GamepadAxisName) => {
    return navigator.getGamepads()[index]?.axes[STANDARD_AXIS_MAPPING[axis]] || 0;
  }, []);

  // const handleGamepadConnected = useCallback((event: GamepadEvent) => {
  //   console.log(
  //       'Gamepad connected at index %d: %s. %d buttons, %d axes.',
  //       event.gamepad.index,
  //       event.gamepad.id,
  //       event.gamepad.buttons.length,
  //       event.gamepad.axes.length,
  //   );
  // }, []);

  // const handleGamepadDisconnected = useCallback((event: GamepadEvent) => {
  //   console.log(
  //       'Gamepad disconnected from index %d: %s.',
  //       event.gamepad.index,
  //       event.gamepad.id,
  //   );
  // }, []);

  // useEffect(() => {
  //   addEventListener('gamepadconnected', handleGamepadConnected);
  //   addEventListener('gamepaddisconnected', handleGamepadDisconnected);

  //   return () => {
  //     removeEventListener('gamepadconnected', handleGamepadConnected);
  //     removeEventListener('gamepaddisconnected', handleGamepadDisconnected);  
  //   };
  // }, [handleGamepadConnected, handleGamepadDisconnected]);

  const context = useMemo(
    () => ({ isButtonDown, getButtonAxis, getAnalogAxis }),
    [isButtonDown, getButtonAxis, getAnalogAxis]
  );

  return (
    <GamepadContext.Provider value={context}>
      {children}
    </GamepadContext.Provider>
  );
};
