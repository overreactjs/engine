import { useContext, useId, useEffect } from "react";
import { Prop, UpdateFunction } from "../types";
import { NodeContext } from "../context";
import { useProperty } from "./useProperty";

/**
 * Register an update function that runs every frame.
 */
export const useUpdate = (fn: UpdateFunction): string => {
  const { registerUpdate } = useContext(NodeContext) || {};
  const id = useId();

  useEffect(() => registerUpdate?.(id, fn), [fn, id, registerUpdate]);

  return id;
};

/**
 * Register an update function that runs every frame, and is guaranteed to run after another
 * update function has completed.
 */
export const useUpdateAfter = (target: string, fn: UpdateFunction): string => {
  const { registerUpdate } = useContext(NodeContext) || {};
  const id = useId();

  useEffect(() => registerUpdate?.(id, fn, { after: target }), [fn, id, registerUpdate]);

  return id;
};

/**
 * Register an update function that runs at a fixed rate, regardless of the native device frame
 * rate. If the desired rate is greater than the maximum frame rate, then the update function will
 * run multiple times each frame.
 */
export const useFixedUpdate = (rate: Prop<number>, fn: UpdateFunction): string => {
  const elapsed = useProperty(0);
  const ups = useProperty(rate);
  const period = useProperty(1000 / ups.current);

  return useUpdate((delta, time) => {
    elapsed.current += delta;

    if (elapsed.current >= period.current) {
      const qty = Math.floor(elapsed.current / period.current);
      elapsed.current = elapsed.current % period.current;

      for (let i = 0; i < qty; i++) {
        fn(period.current, time);
      }
    }
  });
};
