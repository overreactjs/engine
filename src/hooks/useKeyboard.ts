import { useContext } from "react";
import { KeyboardContext } from "../context";
import { useUpdate } from "./useUpdate";

export const useKeyboard = () => {
  return useContext(KeyboardContext);
};

export const useKeyPressed = (key: string, fn: () => void) => {
  const { isKeyPressed } = useKeyboard();

  useUpdate(() => {
    if (isKeyPressed(key)) {
      fn();
    }
  });
};

export const useKeyAxis = (negative: string, positive: string, fn: (value: number) => void) => {
  const { hasKeyAxis } = useKeyboard();

  useUpdate(() => {
    const value = hasKeyAxis(negative, positive);
    fn(value);
  });
};