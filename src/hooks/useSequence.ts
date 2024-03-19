import { useProperty } from "./useProperty";
import { useUpdate } from "./useUpdate";

export const useSequence = (conditions: (() => boolean)[], fn: () => void) => {
  const phase = useProperty(0);

  useUpdate(() => {
    if (conditions[phase.current]()) {
      phase.current++;
    }

    if (phase.current === conditions.length) {
      fn();
      phase.current = 0;
    }
  });
};
