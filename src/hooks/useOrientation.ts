import { useContext } from "react";
import { OrientationContext } from "../context";

export const useOrientation = () => {
  return useContext(OrientationContext);
};
