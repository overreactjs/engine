import { useRef, useCallback, useMemo } from "react";

type EventHandler<T> = (event: T) => void;

type UseEventListenersResult<E, T> = {
  addEventListener: (type: E, fn: EventHandler<T>) => void;
  removeEventListener: (type: E, fn: EventHandler<T>) => void;
  fireEvent: (type: E, payload: T) => void;
}

export function useEventListeners<E, T = undefined>(): UseEventListenersResult<E, T> {
  const listeners = useRef<Map<E, Set<EventHandler<T>>>>(new Map());

  const addEventListener = useCallback((type: E, fn: EventHandler<T>) => {
    if (!listeners.current.has(type)) {
      listeners.current.set(type, new Set());
    }

    listeners.current.get(type)?.add(fn);
  }, []);

  const removeEventListener = useCallback((type: E, fn: EventHandler<T>) => {
    if (listeners.current.get(type)?.has(fn)) {
      listeners.current.get(type)?.delete(fn);
    }
  }, []);

  const fireEvent = useCallback((type: E, payload: T) => {
    for (const listener of listeners.current.get(type) || []) {
      listener(payload);
    }
  }, []);

  return useMemo(() => ({ addEventListener, removeEventListener, fireEvent }), [addEventListener, removeEventListener, fireEvent]);
}
