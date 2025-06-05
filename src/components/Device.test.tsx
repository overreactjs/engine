import { beforeEach, describe, expect, it, Mock } from 'vitest';
import { screen } from '@testing-library/react';
import { useSync } from '../hooks';
import { mockDeviceMotionEvent, mockDeviceOrientationEvent, mockResizeObserver, render } from '../test';
import { DeviceContext } from '../context';
import { useContext } from 'react';
import { Device } from './Device';

const TextFixture = () => {
  const device = useContext(DeviceContext);
  const size = useSync(() => [...device.size.current]);
  return <div>{`[${size[0]}, ${size[1]}]`}</div>;
};

describe('Device', () => {
  describe('device size', () => {
    let observe: Mock;
    let requestMotionPermission: Mock;
    let requestOrientationPermission: Mock;

    beforeEach(() => {
      observe = mockResizeObserver(256, 192);
      requestMotionPermission = mockDeviceMotionEvent();
      requestOrientationPermission = mockDeviceOrientationEvent();
    });

    it('sets up a resize observer ', () => {
      render(
        <Device>
          <TextFixture />
        </Device>
      );

      expect(observe).toHaveBeenCalledOnce();
      expect(screen.getByText('[256, 192]')).toBeDefined();
    });

    it('requests permissions for device orientation events', () => {
      render(<Device>foo</Device>);
      expect(requestOrientationPermission).toHaveBeenCalledOnce();
    });

    it('requests permissions for device motion events', () => {
      render(<Device>foo</Device>);
      expect(requestMotionPermission).toHaveBeenCalledOnce();
    });
  });
});
