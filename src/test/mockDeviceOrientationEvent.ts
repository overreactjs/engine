import { vi } from "vitest";

export const mockDeviceOrientationEvent = () => {
  const fn = vi.fn();
  
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  global.DeviceOrientationEvent = class MockedDeviceOrientationEvent {
    static requestPermission = fn;
  };

  return fn;
};
