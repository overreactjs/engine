import { useContext } from "react";
import { WorldContext } from "../context";

/**
 * @returns A pointer with relative position to the world element
 */
export const useWorld = () => {
  return useContext(WorldContext);
}
  
  