import { useMemo } from "react";
import { Property } from "../types";
import { DynamicProperty } from "../utils";

export function useDynamicProperty<IN, OUT>(
  value: Property<IN>,
  fn: (value: IN) => OUT,
) {
  return useMemo(() => new DynamicProperty(value, fn), [fn, value]);
}
  