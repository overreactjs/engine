import { useCallback, useMemo, useRef } from "react";
import { usePointer } from "./usePointer";
import { Position } from "../types";
import { useTicker } from "./useTicker";

export const useSwipe = () => {
  const pointer = usePointer();
  const started = useRef<Position | null>(null);
  const swiped = useRef(false);
  const distance = useRef<[number, number]>([0, 0]);

  const hasSwiped = useCallback((): boolean => {
    return swiped.current;
  }, []);

  useTicker(() => {
    if (swiped.current) {
      swiped.current = false;
    }

    if (pointer.isDown()) {
      started.current = started.current || [...pointer.pos.current];
      distance.current = [
        pointer.pos.current[0] - started.current[0],
        pointer.pos.current[1] - started.current[1],
      ];

    } else if (started.current !== null) {
      swiped.current = true;
      started.current = null;
    }
  });

  return useMemo(() => ({ hasSwiped, distance }), [hasSwiped, distance]);
};
