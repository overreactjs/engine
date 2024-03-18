import React from "react";
import { GamepadButtonName } from "../types";

type GamepadContextProps = {
  isButtonDown: (index: number, button: GamepadButtonName) => boolean;
  getButtonAxis: (index: number, negative: GamepadButtonName, positive: GamepadButtonName) => number;
  getAnalogAxis: (axis: number) => number;
}

export const GamepadContext = React.createContext<GamepadContextProps>({
  isButtonDown: () => false,
  getButtonAxis: () => 0,
  getAnalogAxis: () => 0,
});
