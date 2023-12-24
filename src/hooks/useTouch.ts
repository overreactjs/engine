import { useContext } from "react";
import { TouchContext } from "../context";

export const useTouch = () => {
  return useContext(TouchContext);
};