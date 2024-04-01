import { useUpdate } from "./useUpdate";
import { useVirtualInput } from "./useVirtualInput";

export const useVirtualAction = (action: string, fn: () => void) => {
  const { isActive } = useVirtualInput();

  useUpdate(() => {
    if (isActive(action)) {
      fn();
    }
  });
};
