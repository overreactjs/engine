import { beforeEach, describe, expect, it, Mock } from 'vitest';
import { useDevice } from '../hooks';
import { mockDeviceMotionEvent, mockDeviceOrientationEvent, mockResizeObserver, renderHook } from '../test';
import { Device, Engine } from '../components';

describe('useDevice', () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Engine>
      <Device>
        {children}
      </Device>
    </Engine>
  );

  let observe: Mock;

  beforeEach(() => {
    observe = mockResizeObserver(256, 192);
    mockDeviceMotionEvent();
    mockDeviceOrientationEvent();
  });

  it('returns the device size', () => {
    const { size } = renderHook(() => useDevice(), { wrapper: Wrapper }).result.current;
    expect(observe).toHaveBeenCalledOnce();
    expect(size.current).toEqual([256, 192]);
  });
});
