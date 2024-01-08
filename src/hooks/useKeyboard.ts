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

type UseKeyAxisHandler = (value: number, delta: number) => void

export const useKeyAxis = (negative: string, positive: string, fn: UseKeyAxisHandler) => {
  const { hasKeyAxis } = useKeyboard();

  useUpdate((delta) => {
    const value = hasKeyAxis(negative, positive);
    fn(value, delta);
  });
};