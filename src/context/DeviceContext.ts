import React from "react";
import { Property, Size } from "../types";

type DeviceContextProps = {
  size: Property<Size>;
}

export const DeviceContext = React.createContext<DeviceContextProps>({
  size: { current: [0, 0] },
});
