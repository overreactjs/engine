import { useMemo, useRef } from "react";
import { Prop, Property } from "../types";

export function useProperty<T>(value: Prop<T>): Property<T> {
  const ref = useRef<T>(typeof value === 'object' && value !== null && 'current' in value ? value.current : value);

  return useMemo(() => {
    return typeof value === 'object' && value !== null && 'current' in value ? value : ref;
  }, [value]);
}
