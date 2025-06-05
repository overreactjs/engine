import { vi } from "vitest";

export const mockResizeObserver = (width: number, height: number) => {
  const observe = vi.fn();

  global.ResizeObserver = class MockedResizeObserver {
    constructor(fn: ResizeObserverCallback) {
      fn([{ contentRect: { width, height } }] as ResizeObserverEntry[], this);
    }
    observe = observe;
    unobserve = vi.fn();
    disconnect = vi.fn();
  };

  return observe;
};
