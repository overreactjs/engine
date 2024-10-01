import { GamepadButtonMap, GamepadButtonName, Prop } from "../types";
import { useGamepad } from "./useGamepad";
import { useProperty } from "./useProperty";
import { useUpdate } from "./useUpdate";
import { useVirtualInput } from "./useVirtualInput";

export const useGamepadButtonMap = (index: Prop<number | null>, map: Prop<GamepadButtonMap>, active?: Prop<boolean>) => {
  const { simulate } = useVirtualInput();
  const { isButtonDown } = useGamepad();

  const gamepadIndex = useProperty(index);
  const isActive = useProperty(active === undefined ? true : active);
  const bindings = useProperty(map);

  useUpdate(() => {
    if (isActive.current && gamepadIndex.current !== null) {
      for (const button in bindings.current) {
        const action = bindings.current[button as GamepadButtonName];
        
        if (action && isButtonDown(gamepadIndex.current, button as GamepadButtonName)) {
          simulate(action);
        }
      }
    }
  });
};
