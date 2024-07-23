import React from "react";
import { GamepadAxisName, GamepadButtonName } from "../types";

type GamepadContextProps = {
  isButtonDown: (index: number, button: GamepadButtonName) => boolean;
  getButtonAxis: (index: number, negative: GamepadButtonName, positive: GamepadButtonName) => number;
  getAnalogAxis: (index:number, axis: GamepadAxisName) => number;
}

export const GamepadContext = React.createContext<GamepadContextProps>({
  isButtonDown: () => false,
  getButtonAxis: () => 0,
  getAnalogAxis: () => 0,
});
