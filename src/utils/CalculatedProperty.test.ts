import { describe, expect, it, vi } from 'vitest';
import { CalculatedProperty } from '.';

describe('CalculatedProperty', () => {
  it('invalidated is always true', () => {
    const prop = new CalculatedProperty(() => 42);
    expect(prop.invalidated).toBe(true);
  });

  describe('when the current value is updated', () => {
    it('does nothing', () => {
      const prop = new CalculatedProperty(() => 42);
      prop.current = 43;
      expect(prop.current).toBe(42);
    });
  });

  describe('when a listener is attached', () => {
    it('it is called immediately with the current value', () => {
      const prop = new CalculatedProperty(() => 42);
      const fn = vi.fn();

      prop.listen(fn);
      expect(fn).toBeCalledTimes(1);
      expect(fn).toBeCalledWith(42);
    });
  });
});