import { useRef, useCallback, useMemo } from "react";
import { EventHandler, UseEventListenersResult } from "../types";
import { EventTarget } from "../utils/EventTarget";

export function useEventListeners<E, T = undefined>(): UseEventListenersResult<E, T> {
  const events = useRef(new EventTarget<E, T>());

  const addEventListener = useCallback((type: E, fn: EventHandler<T>) => {
    events.current.addEventListener(type, fn);
  }, []);

  const removeEventListener = useCallback((type: E, fn: EventHandler<T>) => {
    events.current.removeEventListener(type, fn);
  }, []);

  const fireEvent = useCallback((type: E, payload: T) => {
    events.current.fireEvent(type, payload);
  }, []);

  return useMemo(() => ({ addEventListener, removeEventListener, fireEvent }), [addEventListener, removeEventListener, fireEvent]);
}
