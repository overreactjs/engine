import { useContext } from "react";
import { VirtualInputContext } from "../context";

export const useVirtualInput = () => {
  return useContext(VirtualInputContext);
};
