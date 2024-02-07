import { useContext } from "react";
import { VirtualInputContext } from "../context";
import { useUpdate } from "./useUpdate";

export const useVirtualInput = () => {
  return useContext(VirtualInputContext);
};

export const useVirtualAction = (action: string, fn: () => void) => {
  const { isActive } = useVirtualInput();

  useUpdate(() => {
    if (isActive(action)) {
      fn();
    }
  });
};
