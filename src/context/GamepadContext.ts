import React from "react";
import { GamepadAxisName, GamepadButtonName } from "../types";

type GamepadContextProps = {
  down: React.MutableRefObject<Set<GamepadButtonName>>;
  isButtonDown: (index: number | null, button: GamepadButtonName) => boolean;
  getButtonAxis: (index: number | null, negative: GamepadButtonName, positive: GamepadButtonName) => number;
  getAnalogAxis: (index: number | null, axis: GamepadAxisName) => number;
  vibrate: (index: number | null, duration: number, magnitude: number) => void;
}

export const GamepadContext = React.createContext<GamepadContextProps>({
  down: { current: new Set() },
  isButtonDown: () => false,
  getButtonAxis: () => 0,
  getAnalogAxis: () => 0,
  vibrate: () => {},
});
