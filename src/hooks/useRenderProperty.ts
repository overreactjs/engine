import { useRef } from "react";
import { Property } from "../types";
import { useRender } from "./useRender";

/**
 * Invoke the given function each render cycle, if the property has changed, then clear the
 * invalidation flag so that it doesn't re-render next frame.
 */
export function useRenderProperty<T>(prop: Property<T>, fn: (value: T) => void) {
  const ref = useRef(fn);

  useRender(() => {
    if (prop.invalidated) {
      prop.invalidated = false;
      ref.current(prop.current);
    }
  });
}
