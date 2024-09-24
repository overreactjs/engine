import { useProperty } from ".";
import { KeyboardKeyName, KeyboardMap, Prop } from "../types";
import { useKeyboard } from "./useKeyboard";
import { useUpdate } from "./useUpdate";
import { useVirtualInput } from "./useVirtualInput";

export const useKeyboardMap = (map: Prop<KeyboardMap>, active?: Prop<boolean>) => {
  const { simulate } = useVirtualInput();
  const { isKeyDown } = useKeyboard();

  const isActive = useProperty(active === undefined ? true : active);
  const bindings = useProperty(map);

  useUpdate(() => {
    if (isActive.current) {
      for (const key in bindings.current) {
        const action = bindings.current[key as KeyboardKeyName];
        
        if (action && key !== null && isKeyDown(key as KeyboardKeyName)) {
          simulate(action);
        }
      }
    }
  });
};
