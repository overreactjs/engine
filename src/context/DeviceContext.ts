import React from "react";
import { Property, Size } from "../types";
import { VariableProperty } from "../utils";

type DeviceContextProps = {
  size: Property<Size>;
}

export const DeviceContext = React.createContext<DeviceContextProps>({
  size: new VariableProperty([0, 0]),
});
