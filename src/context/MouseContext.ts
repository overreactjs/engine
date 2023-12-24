import React from "react";
import { Position, Property } from "../types";

type MouseContextProps = {
  pos: Property<Position>;
  isDown: (button: number) => boolean;
  isPressed: (button: number) => boolean;
  isTarget: (element: Property<Element | null> | Element | null) => boolean;
};

export const MouseContext = React.createContext<MouseContextProps>({
  pos: { current: [0, 0] },
  isDown: () => false,
  isPressed: () => false,
  isTarget: () => false,
});
