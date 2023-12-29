import React from "react";
import { Property } from "../types";
import { VariableProperty } from "../utils";

export type MotionContextProps = {
  acceleration: Property<[number, number, number]>;
  isShaking: () => boolean;
};

export const MotionContext = React.createContext<MotionContextProps>({
  acceleration: new VariableProperty([0, 0, 0]),
  isShaking: () => false,
});
