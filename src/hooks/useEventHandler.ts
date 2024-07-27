import { useEffect } from "react";
import { UseEventTarget } from "../types";

export function useEventHandler<E, T>(target: UseEventTarget<E, T>, name: E, fn: (payload: T) => void): void {
  useEffect(() => {
    target.addEventListener(name, fn);
    return () => target.removeEventListener(name, fn);
  }, [fn, name, target]);
}
