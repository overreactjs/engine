import  { describe, expect, it, vi } from "vitest";
import { nextFrame, renderHook } from "../test";
import { useDeviceShaken, useMotion } from "./useMotion";

describe('useMotion', () => {
  describe('acceleration', () => {
    it('default to all zeroes', () => {
      const { result } = renderHook(() => useMotion());
      const { acceleration } = result.current;
      expect(acceleration.current).toEqual([0, 0, 0]);
    });

    it('responds to device motion events', () => {
      const { result } = renderHook(() => useMotion());
      const { acceleration } = result.current;

      dispatchEvent(new DeviceMotionEvent('devicemotion', {
        acceleration: { x: 3, y: 4, z: 5 },
      }));
      expect(acceleration.current).toEqual([3, 4, 5]);

      dispatchEvent(new DeviceMotionEvent('devicemotion', {
        acceleration: { x: 3, y: 4, z: 5 },
      }));
      expect(acceleration.current).toEqual([3, 4, 5]);
    });
  });

  describe('isShaking', () => {
    describe('when the shake amount is above the threshold', () => {
      describe('in the x axis', () => {
        it('returns true', () => {
          const { result } = renderHook(() => useMotion());
          const { isShaking } = result.current;
  
          dispatchEvent(new DeviceMotionEvent('devicemotion', {
            acceleration: { x: 25, y: 0, z: 0 },
          }));

          expect(isShaking()).toBe(true);
        });
      });

      describe('in the y axis', () => {
        it('returns true', () => {
          const { result } = renderHook(() => useMotion());
          const { isShaking } = result.current;
  
          dispatchEvent(new DeviceMotionEvent('devicemotion', {
            acceleration: { x: 0, y: 25, z: 0 },
          }));

          expect(isShaking()).toBe(true);
        });
      });

      describe('in the z axis', () => {
        it('returns true', () => {
          const { result } = renderHook(() => useMotion());
          const { isShaking } = result.current;
  
          dispatchEvent(new DeviceMotionEvent('devicemotion', {
            acceleration: { x: 0, y: 0, z: 25 },
          }));

          expect(isShaking()).toBe(true);
        });
      });

      describe('in a combination of all three axes', () => {
        it('returns true', () => {
          const { result } = renderHook(() => useMotion());
          const { isShaking } = result.current;
  
          dispatchEvent(new DeviceMotionEvent('devicemotion', {
            acceleration: { x: 8.5, y: 8.5, z: 8.5 },
          }));

          expect(isShaking()).toBe(true);
        });
      });
    });

    describe('when the shake amount is below the threshold', () => {
      it('returns false', () => {
        const { result } = renderHook(() => useMotion());
        const { isShaking } = result.current;

        dispatchEvent(new DeviceMotionEvent('devicemotion', {
          acceleration: { x: 8, y: 8, z: 8 },
        }));

        expect(isShaking()).toBe(false);
      });
    });

    describe('when a cooldown period is set', () => {
      it('returns true for one frame, then not until after the cooldown period', () => {
        const { result } = renderHook(() => useMotion());
        const { isShaking } = result.current;

        dispatchEvent(new DeviceMotionEvent('devicemotion', {
          acceleration: { x: 25, y: 0, z: 0 },
        }));

        expect(isShaking(50)).toBe(true);

        nextFrame(); // 15ms
        expect(isShaking(50)).toBe(false);

        nextFrame(); // 30ms
        expect(isShaking(50)).toBe(false);

        nextFrame(); // 45ms
        expect(isShaking(50)).toBe(false);

        nextFrame(); // 60ms
        expect(isShaking(50)).toBe(true);
      });
    })
  });
});

describe('useDeviceShaken', () => {
  describe('when the device is shaken', () => {
    it('calls the callback once, until after the cooldown period', () => {
      const callback = vi.fn();
      renderHook(() => useDeviceShaken(50, callback));

      dispatchEvent(new DeviceMotionEvent('devicemotion', {
        acceleration: { x: 25, y: 0, z: 0 },
      }));

      nextFrame(); // 0ms
      expect(callback).toHaveBeenCalledOnce();

      nextFrame(); // 15ms
      expect(callback).toHaveBeenCalledOnce();

      nextFrame(); // 30ms
      expect(callback).toHaveBeenCalledOnce();

      nextFrame(); // 45ms
      expect(callback).toHaveBeenCalledOnce();

      nextFrame(); // 60ms
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });
});