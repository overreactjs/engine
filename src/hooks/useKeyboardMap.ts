import { useProperty } from ".";
import { KeyboardKeyName, KeyboardMap, Prop } from "../types";
import { useKeyboard } from "./useKeyboard";
import { useUpdate } from "./useUpdate";
import { useVirtualInput } from "./useVirtualInput";

export const useKeyboardMap = (map: KeyboardMap, active?: Prop<boolean>) => {
  const { simulate } = useVirtualInput();
  const { isKeyDown } = useKeyboard();

  const isActive = useProperty(active === undefined ? true : active);

  useUpdate(() => {
    if (isActive.current) {
      for (const key in map) {
        const action = map[key as KeyboardKeyName];
        
        if (action && key !== null && isKeyDown(key)) {
          simulate(action);
        }
      }
    }
  });
};
