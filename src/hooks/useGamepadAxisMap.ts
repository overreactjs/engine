import { GamepadAxisMap, GamepadAxisName, Prop } from "../types";
import { useGamepad } from "./useGamepad";
import { useProperty } from "./useProperty";
import { useUpdate } from "./useUpdate";
import { useVirtualInput } from "./useVirtualInput";

const THRESHOLD = 0.5;

export const useGamepadAxisMap = (index: Prop<number>, map: GamepadAxisMap, active?: Prop<boolean>) => {
  const { simulate } = useVirtualInput();
  const { getAnalogAxis } = useGamepad();

  const gamepadIndex = useProperty(index);
  const isActive = useProperty(active === undefined ? true : active);

  useUpdate(() => {
    if (isActive.current) {
      for (const axis in map) {
        const [negative, positive] = map[axis as GamepadAxisName] || [];
        
        if (negative && getAnalogAxis(gamepadIndex.current, axis as GamepadAxisName) <= -THRESHOLD) {
          simulate(negative);
        }

        if (positive && getAnalogAxis(gamepadIndex.current, axis as GamepadAxisName) >= THRESHOLD) {
          simulate(positive);
        }
      }
    }
  });
};