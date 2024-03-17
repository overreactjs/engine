import { useProperty } from ".";
import { Prop } from "../types";
import { useKeyboard } from "./useKeyboard";
import { useUpdate } from "./useUpdate";
import { useVirtualInput } from "./useVirtualInput";

type KeyboardMap = Record<string, string>;

export const useKeyboardMap = (map: KeyboardMap, active?: Prop<boolean>) => {
  const { simulate } = useVirtualInput();
  const { isKeyDown } = useKeyboard();

  const isActive = useProperty(active === undefined ? true : active);

  useUpdate(() => {
    if (isActive.current) {
      for (const key in map) {
        const action = map[key];
        
        if (key !== null && isKeyDown(key)) {
          simulate(action);
        }
      }
    }
  });
};
