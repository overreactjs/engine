import { useContext } from "react";
import { WorldContext } from "../context";

export const useWorld = () => {
  return useContext(WorldContext);
}
  
  