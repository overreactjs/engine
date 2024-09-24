import React from "react";
import { KeyboardKeyName } from "../types";

type KeyboardContextProps = {
  down: React.MutableRefObject<Set<string>>;
  pressed: React.MutableRefObject<Set<string>>;
  isKeyDown: (code: KeyboardKeyName) => boolean;
  isAnyKeyDown: () => boolean;
  isKeyPressed: (code: KeyboardKeyName) => boolean;
  isAnyKeyPressed: () => boolean;
  hasKeyAxis: (negative: KeyboardKeyName, positive: KeyboardKeyName) => number;
  simulateKeyDown: (code: KeyboardKeyName) => void;
  simulateKeyUp: (code: KeyboardKeyName) => void;
}

export const KeyboardContext = React.createContext<KeyboardContextProps>({
  down: { current: new Set() },
  pressed: { current: new Set() },
  isKeyDown: () => false,
  isAnyKeyDown: () => false,
  isKeyPressed: () => false,
  isAnyKeyPressed: () => false,
  hasKeyAxis: () => 0,
  simulateKeyDown: () => {},
  simulateKeyUp: () => {},
});