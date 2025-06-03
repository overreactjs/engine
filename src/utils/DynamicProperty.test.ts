import { describe, expect, it, vi } from 'vitest';
import { Validator, DynamicProperty, VariableProperty } from '.';

describe('DynamicProperty', () => {
  it('invalidated defaults to true', () => {
    const source = new VariableProperty(42);
    const prop = new DynamicProperty(source, (source) => source + 1);
    expect(prop.invalidated).toBe(true);
  });

  describe('when the source value changes', () => {
    it('set the invalidated flag', () => {
      const source = new VariableProperty(42);
      const prop = new DynamicProperty(source, (source) => source + 1);
      prop.invalidated = false;
      Validator.run();
      expect(prop.invalidated).toBe(false);

      source.current = 45;
      expect(prop.invalidated).toBe(true);
      expect(prop.current).toBe(46);
    });
  });

  describe('listeners', () => {
    describe('when a scalar property changes', () => {
      it('calls the listener function with the output value, not the source value', () => {
        const source = new VariableProperty(42);
        const prop = new DynamicProperty(source, (source) => source + 1);
        const fn = vi.fn();

        prop.listen(fn);
        expect(fn).not.toBeCalled();
  
        source.current = 45;
        expect(fn).toBeCalledTimes(1);
        expect(fn).toBeCalledWith(46);
      });
    });

    describe('when an entry of an array property changes', () => {
      it('calls the listener function', () => {
        const source = new VariableProperty(['a', 'b']);
        const prop = new DynamicProperty(source, (source) => source.join('|'));
        const fn = vi.fn();

        prop.listen(fn);
        expect(fn).not.toBeCalled();
  
        source.current[0] = 'c';
        expect(fn).toBeCalledTimes(1);
        expect(fn).toBeCalledWith('c|b');
      });
    });
  });
});