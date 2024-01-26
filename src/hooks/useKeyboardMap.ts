import { useKeyboard } from "./useKeyboard";
import { useUpdate } from "./useUpdate";
import { useVirtualInput } from "./useVirtualInput";

type KeyboardMap = Record<string, string | null>;

export const useKeyboardMap = (map: KeyboardMap) => {
  const { simulate } = useVirtualInput();
  const { isKeyDown } = useKeyboard();

  useUpdate(() => {
    for (const action in map) {
      const key = map[action];
      
      if (key !== null && isKeyDown(key)) {
        simulate(action);
      }
    }
  });
};
