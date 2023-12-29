import { useMemo } from "react";
import { Prop, Property } from "../types";
import { VariableProperty } from "../utils";

export function useProperty<T>(value: Prop<T>): Property<T> {
  return useMemo(() => {
    if (value instanceof VariableProperty) {
      return value;
    } else if (typeof value === 'object' && value !== null && 'current' in value && 'invalidated' in value) {
      return value;
    } else {
      return new VariableProperty(value);
    }
  }, [value]);
}
