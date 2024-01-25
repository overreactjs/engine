import { useMemo, useRef } from "react";
import { Prop, Property } from "../types";
import { VariableProperty } from "../utils";

export function useProperty<T>(value: Prop<T>): Property<T> {
  const ref = useRef(value);

  return useMemo(() => {
    if (ref.current instanceof VariableProperty) {
      return ref.current;
    } else if (typeof ref.current === 'object' && ref.current !== null && 'current' in ref.current && 'invalidated' in ref.current) {
      return ref.current;
    } else {
      return new VariableProperty(ref.current);
    }
  }, [ref]);
}
