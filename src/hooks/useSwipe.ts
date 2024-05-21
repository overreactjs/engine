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
      const [x, y] = pointer.pos.current;

      if (!Number.isNaN(x) && !Number.isNaN(y)) {
        if (!started.current) {
          started.current = [x, y];  
        } else {
          distance.current = [x - started.current[0], y - started.current[1]];
        }
      }
    } else if (started.current !== null) {
      swiped.current = true;
      started.current = null;
    }
  });

  return useMemo(() => ({ hasSwiped, distance }), [hasSwiped, distance]);
};
