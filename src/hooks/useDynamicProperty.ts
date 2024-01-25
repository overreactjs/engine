import { useMemo, useRef } from "react";
import { Property } from "../types";
import { DynamicProperty } from "../utils";

export function useDynamicProperty<IN, OUT>(
  value: Property<IN>,
  fn: (value: IN) => OUT,
) {
  const ref = useRef(fn);
  return useMemo(() => new DynamicProperty(value, ref.current), [ref, value]);
}
  