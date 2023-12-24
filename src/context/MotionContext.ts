import React from "react";
import { Property } from "../types";

export type MotionContextProps = {
  acceleration: Property<[number, number, number]>;
  isShaking: () => boolean;
};

export const MotionContext = React.createContext<MotionContextProps>({
  acceleration: { current: [0, 0, 0] },
  isShaking: () => false,
});
