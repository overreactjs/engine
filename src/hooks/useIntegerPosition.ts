import { Position, Property } from "../types";
import { useDynamicProperty } from "./useDynamicProperty";

export const useIntegerPosition = (pos: Property<Position>) => {
  return useDynamicProperty(pos, (pos): Position => [
    Math.round(pos[0]),
    Math.round(pos[1]),
  ]);
};
