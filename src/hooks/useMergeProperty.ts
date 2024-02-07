import { useMemo, useRef } from "react";
import { Property } from "../types";
import { MergeProperty } from "../utils";

export function useMergeProperty<A, B, OUT>(
  a: Property<A>,
  b: Property<B>,
  fn: (a: A, b: B) => OUT,
) {
  const ref = useRef(fn);
  return useMemo(() => new MergeProperty(a, b, ref.current), [ref, a, b]);
}
