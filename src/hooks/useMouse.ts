import { useContext } from "react";
import { MouseContext } from "../context";

export const useMouse = () => {
  return useContext(MouseContext);
};