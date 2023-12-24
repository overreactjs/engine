import { useContext } from "react";
import { DeviceContext } from "../context";

export const useDevice = () => {
  return useContext(DeviceContext);
};