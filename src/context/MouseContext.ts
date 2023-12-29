import React, { MutableRefObject } from "react";
import { Position, Property } from "../types";
import { VariableProperty } from "../utils";

type MouseContextProps = {
  pos: Property<Position>;
  isDown: (button: number) => boolean;
  isPressed: (button: number) => boolean;
  isTarget: (element: MutableRefObject<Element | null> | Element | null) => boolean;
};

export const MouseContext = React.createContext<MouseContextProps>({
  pos: new VariableProperty([0, 0]),
  isDown: () => false,
  isPressed: () => false,
  isTarget: () => false,
});
