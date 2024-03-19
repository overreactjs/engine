import { afterEach, beforeAll, vi } from 'vitest';

const FRAME = 15;
let currentTime = 0;

beforeAll(() => {
  vi.useFakeTimers();

  global.requestAnimationFrame = vi.fn((callback) => {
    setTimeout(() => {
      currentTime += FRAME;
      callback(currentTime);
    }, FRAME);
    return 1;
  });
});

afterEach(() => {
  vi.clearAllTimers();
  currentTime = 0;
})