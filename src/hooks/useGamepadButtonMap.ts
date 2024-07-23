import { GamepadButtonMap, GamepadButtonName, Prop } from "../types";
import { useGamepad } from "./useGamepad";
import { useProperty } from "./useProperty";
import { useUpdate } from "./useUpdate";
import { useVirtualInput } from "./useVirtualInput";

export const useGamepadButtonMap = (index: Prop<number>, map: GamepadButtonMap, active?: Prop<boolean>) => {
  const { simulate } = useVirtualInput();
  const { isButtonDown } = useGamepad();

  const gamepadIndex = useProperty(index);
  const isActive = useProperty(active === undefined ? true : active);

  useUpdate(() => {
    if (isActive.current) {
      for (const button in map) {
        const action = map[button as GamepadButtonName];
        
        if (action && isButtonDown(gamepadIndex.current, button as GamepadButtonName)) {
          simulate(action);
        }
      }
    }
  });
};
