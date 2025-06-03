import { describe, expect, it, vi } from 'vitest';
import { Validator, MergeProperty, VariableProperty } from '.';

describe('MergeProperty', () => {
  it('invalidated defaults to true', () => {
    const a = new VariableProperty(1);
    const b = new VariableProperty(2);
    const prop = new MergeProperty(a, b, (a, b) => [a, b]);
    expect(prop.invalidated).toBe(true);
  });

  it('combines the source properties via the merge funtion', () => {
    const a = new VariableProperty(1);
    const b = new VariableProperty(2);
    const prop = new MergeProperty(a, b, (a, b) => [a, b]);
    expect(prop.current).toEqual([1, 2])
  });

  describe('when either of the source values change', () => {
    it('set the invalidated flag', () => {
      const a = new VariableProperty(1);
      const b = new VariableProperty(2);
      const prop = new MergeProperty(a, b, (a, b) => [a, b]);
      prop.invalidated = false;
      Validator.run();
      expect(prop.invalidated).toBe(false);

      a.current = 3;
      expect(prop.invalidated).toBe(true);
      expect(prop.current).toEqual([3, 2]);

      prop.invalidated = false;
      Validator.run();
      expect(prop.invalidated).toBe(false);

      b.current = 4;
      expect(prop.invalidated).toBe(true);
      expect(prop.current).toEqual([3, 4]);

      prop.invalidated = false;
      Validator.run();
      expect(prop.invalidated).toBe(false);
    });
  });

  describe('listeners', () => {
    describe('when either of the source values change', () => {
      it('calls the listener function', () => {
        const a = new VariableProperty(1);
        const b = new VariableProperty(2);
        const prop = new MergeProperty(a, b, (a, b) => [a, b]);
        const fn = vi.fn();

        prop.listen(fn);
        expect(fn).not.toBeCalled();
  
        a.current = 3;
        expect(fn).toBeCalledTimes(1);
        expect(fn).toBeCalledWith([3, 2]);
  
        b.current = 4;
        expect(fn).toBeCalledTimes(2);
        expect(fn).toBeCalledWith([3, 4]);
      });
    });
  });
});