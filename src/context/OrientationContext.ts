import React from "react";
import { Property } from "../types";
import { VariableProperty } from "../utils";

export type OrientationContextProps = {
  alpha: Property<number>;
  beta: Property<number>;
  gamma: Property<number>;
};

export const OrientationContext = React.createContext<OrientationContextProps>({
  alpha: new VariableProperty(0),
  beta: new VariableProperty(0),
  gamma: new VariableProperty(0),
});
