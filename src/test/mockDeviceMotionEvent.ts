import { vi } from "vitest";

export const mockDeviceMotionEvent = () => {
  const fn = vi.fn();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  global.DeviceMotionEvent = class MockedDeviceMotionEvent {
    static requestPermission = fn;
  };

  return fn;
};
