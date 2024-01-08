import { useContext } from "react";
import { WorldContext } from "../context";

/**
 * @returns An pointer with relative position to the world element
 */
export const useWorld = () => {
  return useContext(WorldContext);
}
  
  