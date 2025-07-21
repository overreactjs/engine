import { useMemo, useRef } from "react";
import { Property } from "../types";
import { CalculatedProperty } from "../utils";

export function useCalculatedProperty<OUT>(fn: () => OUT): Property<OUT> {
  const ref = useRef(fn);

  return useMemo(() => new CalculatedProperty(ref.current), [ref]);
}
