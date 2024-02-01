import { Position, Property } from "../types";
import { useDynamicProperty } from "./useDynamicProperty";

export const useIntegerPosition = (pos: Property<Position>) => {
  return useDynamicProperty(pos, (pos): Position => [
    (pos[0] + 0.5) << 0,
    (pos[1] + 0.5) << 0,
  ]);
};
