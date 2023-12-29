import React from "react";
import { Position, Property } from "../types";
import { VariableProperty } from "../utils";

type TouchContextProps = {
  pos: Property<Position>;
  isDown: (element: Element) => boolean;
  isPressed: (element: Element) => boolean;
};

export const TouchContext = React.createContext<TouchContextProps>({
  pos: new VariableProperty([0, 0]),
  isDown: () => false,
  isPressed: () => false,
});
