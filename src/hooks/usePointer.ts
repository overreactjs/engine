import { useContext } from "react";
import { PointerContext } from "../context";

/**
 * @returns The absolute position of the pointer.
 * If you want the relative pointer, use `useWorld().pointer`
 */
export const usePointer = () => {
  return useContext(PointerContext);
};