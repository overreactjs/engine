import React, { useCallback, useEffect, useMemo } from "react";
import { MotionContext } from "../context";
import { useKeyPressed, useProperty } from "../hooks";

type MotionProps = {
  children: React.ReactNode;
}

/**
 * Motion
 * ------
 * 
 * Provides access to the current acceleration of the device along three axes. Implemented using
 * 'devicemotion' events, which have to be activated on some devices.
 */
export const Motion: React.FC<MotionProps> = ({ children }) => {
  const acceleration = useProperty<[number, number, number]>([0, 0, 0]);

  /**
   * Returns true whilst the user is shaking the device, above a set threshold.
   */
  const isShaking = useCallback(() => {
    const [x, y, z] = acceleration.current;
    return Math.abs(x) + Math.abs(y) + Math.abs(z) > 25;
  }, [acceleration]);

  /**
   * Handle raw device motion events, storing the current acceleration.
   */
  const handleDeviceMotion = useCallback((event: DeviceMotionEvent) => {
    const { x, y, z } = event.acceleration || {};
    acceleration.current = [x || 0, y || 0, z || 0];
  }, [acceleration]);
    
  /**
   * Attach key event handlers to the window, to capture all events.
   */
  useEffect(() => {
    addEventListener('devicemotion', handleDeviceMotion);

    return () => {
      removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [handleDeviceMotion]);

  /**
   * In development, when the app is running in a browser, simulate shaking the device using the
   * S key.
   */
  useKeyPressed('KeyS', () => {
    acceleration.current = [50, 0, 0];
    setTimeout(() => acceleration.current = [0, 0, 0], 300);
  });

  const context = useMemo(
    () => ({ acceleration, isShaking }),
    [acceleration, isShaking],
  );

  return (
    <MotionContext.Provider value={context}>
      {children}
    </MotionContext.Provider>
  );
};
