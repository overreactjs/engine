import { useEffect, useMemo, useRef } from "react";
import { Prop, Property } from "../types";
import { VariableProperty } from "../utils";

export function useProperty<T>(value: Prop<T>): Property<T> {
  const ref = useRef(value);

  const property = useMemo(() => {
    if (ref.current instanceof VariableProperty) {
      return ref.current;
    } else if (typeof ref.current === 'object' && ref.current !== null && 'current' in ref.current && 'invalidated' in ref.current) {
      return ref.current;
    } else {
      return new VariableProperty(ref.current);
    }
  }, [ref]);

  /**
   * Update the property value when the input value changes, but only for scalars, since objects
   * that are passed directly as props will otherwise trigger a change every cycle.
   */
  useEffect(() => {
    if (!(value instanceof Object)) {
      property.current = value;
    }
  }, [property, value]);

  return property;
}
