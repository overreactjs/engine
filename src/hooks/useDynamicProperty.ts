import { useMemo, useRef } from "react";
import { Property } from "../types";
import { DynamicProperty } from "../utils";

/**
 * Create a new dynamic property, with a value derived from another property.
 */
export function useDynamicProperty<IN, OUT>(
  value: Property<IN>,
  fn: (value: IN) => OUT,
) {
  const ref = useRef(fn);

  return useMemo(() => new DynamicProperty(value, ref.current), [ref, value]);
}

/**
 * Create a new dynamic property, with a value derived from another property, with the output
 * values cached against the input values, so the function will only be called when an unseen input
 * values is encountered.
 */
export function useCachedDynamicProperty<IN, OUT>(
  value: Property<IN>,
  fn: (value: IN) => OUT,
) {
  const cache = useRef<Map<IN, OUT>>(new Map());
  const ref = useRef((value: IN): OUT => {
    const cached = cache.current.get(value);

    if (cached !== undefined) {
      return cached;
    }

    const output = fn(value);
    cache.current.set(value, output);
    return output
  });

  return useMemo(() => new DynamicProperty(value, ref.current), [ref, value]);
}
