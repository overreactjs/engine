/* eslint-disable @typescript-eslint/no-explicit-any */

import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

let currentTime = 0;

/**
 * Use fake timers so that we can step through one frame at a time.
 */
beforeAll(() => {
  vi.useFakeTimers();
});

/**
 * Full cleanup of the whole dom.
 */
afterEach(() => {
  cleanup();
});

/**
 * Implement a fake raf function, which runs in a way that we can step through with fake timers.
 */
beforeAll(() => {
  global.requestAnimationFrame = vi.fn((callback) => {
    setTimeout(() => {
      currentTime += 15;
      callback(currentTime);
    }, 15);
    return 1;
  });
});

/**
 * Reset our fake raf implementation.
 */
afterEach(() => {
  vi.clearAllTimers();
  currentTime = 0;
});

/**
 * 
 */
type DeviceMotionEventAcceleration = {
  x: number;
  y: number;
  z: number;
};

type DeviceMotionEventOptions = {
  acceleration: DeviceMotionEventAcceleration;
};

class DeviceMotionEvent extends Event {
  readonly acceleration: any;

  constructor(type: string, options: DeviceMotionEventOptions) {
    super(type);
    this.acceleration = options.acceleration;
  }
}

window.DeviceMotionEvent = DeviceMotionEvent as any;

class AudioContext {

}

window.AudioContext = AudioContext as any;