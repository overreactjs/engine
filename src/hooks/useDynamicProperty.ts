import { useMemo } from "react";
import { Property } from "../types";

export function useDynamicProperty<IN, OUT>(
  value: Property<IN>,
  fn: (value: IN) => OUT,
) {
  return useMemo(() => new DynamicProperty(value, fn), [fn, value]);
}

export class DynamicProperty<IN, OUT> {
  
  value: Property<IN>;
  fn: (value: IN) => OUT;

  constructor(value: Property<IN>, fn: (value: IN) => OUT) {
    this.value = value;
    this.fn = fn;
  }
  
  get current(): OUT {
    return this.fn(this.value.current);
  }
}
  