import React, { MutableRefObject } from "react";
import { Position, Property } from "../types";
import { VariableProperty } from "../utils";

type PointerContextProps = {
  pos: Property<Position>;
  isDown: () => boolean;
  isPressed: () => boolean;
  isTarget: (element: MutableRefObject<Element | null> | Element | null) => boolean;
};

export const PointerContext = React.createContext<PointerContextProps>({
  pos: new VariableProperty([0, 0]),
  isDown: () => false,
  isPressed: () => false,
  isTarget: () => false,
});
