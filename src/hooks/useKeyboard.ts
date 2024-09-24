import { useContext } from "react";
import { KeyboardContext } from "../context";
import { useUpdate } from "./useUpdate";
import { KeyboardKeyName } from "../types";

export const useKeyboard = () => {
  return useContext(KeyboardContext);
};

export const useKeyPressed = (key: KeyboardKeyName, fn: () => void) => {
  const { isKeyPressed } = useKeyboard();

  useUpdate(() => {
    if (isKeyPressed(key)) {
      fn();
    }
  });
};

type UseKeyAxisHandler = (value: number, delta: number) => void

export const useKeyAxis = (negative: KeyboardKeyName, positive: KeyboardKeyName, fn: UseKeyAxisHandler) => {
  const { hasKeyAxis } = useKeyboard();

  useUpdate((delta) => {
    const value = hasKeyAxis(negative, positive);
    fn(value, delta);
  });
};
