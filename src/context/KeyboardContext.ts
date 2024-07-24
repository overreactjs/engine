import React from "react";
import { KeyboardKeyName } from "../types";

type KeyboardContextProps = {
  isKeyDown: (code: KeyboardKeyName) => boolean;
  isKeyPressed: (code: KeyboardKeyName) => boolean;
  hasKeyAxis: (negative: KeyboardKeyName, positive: KeyboardKeyName) => number;
  simulateKeyDown: (code: KeyboardKeyName) => void;
  simulateKeyUp: (code: KeyboardKeyName) => void;
}

export const KeyboardContext = React.createContext<KeyboardContextProps>({
  isKeyDown: () => false,
  isKeyPressed: () => false,
  hasKeyAxis: () => 0,
  simulateKeyDown: () => {},
  simulateKeyUp: () => {},
});