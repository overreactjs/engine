import { GamepadButtonName, Prop } from "../types";
import { useGamepad } from "./useGamepad";
import { useProperty } from "./useProperty";
import { useUpdate } from "./useUpdate";
import { useVirtualInput } from "./useVirtualInput";

type GamepadMap = Partial<Record<GamepadButtonName, string>>;

export const useGamepadMap = (index: number, map: GamepadMap, active?: Prop<boolean>) => {
  const { simulate } = useVirtualInput();
  const { isButtonDown } = useGamepad();

  const isActive = useProperty(active === undefined ? true : active);

  useUpdate(() => {
    if (isActive.current) {
      for (const button in map) {
        const action = map[button as GamepadButtonName];
        
        if (action && isButtonDown(index, button as GamepadButtonName)) {
          simulate(action);
        }
      }
    }
  });
};
