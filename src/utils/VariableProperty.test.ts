import { describe, expect, it, vi } from 'vitest';
import { Validator, VariableProperty } from '.';

describe('VariableProperty', () => {
  it('invalidated defaults to true', () => {
    const prop = new VariableProperty(42);
    expect(prop.invalidated).toBe(true);
  });

  describe('scalar values', () => {
    describe('when the value changes', () => {
      it('set the invalidated flag', () => {
        const prop = new VariableProperty(42);
        prop.invalidated = false;
        Validator.run();
        expect(prop.invalidated).toBe(false);

        prop.current = 42;
        expect(prop.invalidated).toBe(true);
      });
    });
  });

  describe('object values', () => {
    describe('when the values changes', () => {
      it('set the invalidated flag', () => {
        const prop = new VariableProperty({ foo: 'bar' });
        prop.invalidated = false;
        Validator.run();
        expect(prop.invalidated).toBe(false);

        prop.current = { foo: 'bar' };
        expect(prop.invalidated).toBe(true);
      });
    });

    describe('when a property of the value changes', () => {
      it('set the invalidated flag', () => {
        const prop = new VariableProperty({ foo: 'bar' });
        prop.invalidated = false;
        Validator.run();
        expect(prop.invalidated).toBe(false);

        prop.current.foo = 'qux';
        expect(prop.invalidated).toBe(true);
      });
    });
  });

  describe('listeners', () => {
    describe('when a scalar property changes', () => {
      it('calls the listener function', () => {
        const property = new VariableProperty(42);
        const fn = vi.fn();

        property.listen(fn);
        expect(fn).not.toBeCalled();
  
        property.current = 43;
        expect(fn).toBeCalledTimes(1);
        expect(fn).toBeCalledWith(43);
      });
    });

    describe('when an array property changes', () => {
      it('calls the listener function', () => {
        const property = new VariableProperty(['a', 'b']);
        const fn = vi.fn();

        property.listen(fn);
        expect(fn).not.toBeCalled();
  
        property.current = ['c', 'd'];
        expect(fn).toBeCalledTimes(1);
        expect(fn).toBeCalledWith(['c', 'd']);
      });
    });

    describe('when an entry of an array property changes', () => {
      it('calls the listener function', () => {
        const property = new VariableProperty(['a', 'b']);
        const fn = vi.fn();

        property.listen(fn);
        expect(fn).not.toBeCalled();
  
        property.current[0] = 'c';
        expect(fn).toBeCalledTimes(1);
        expect(fn).toBeCalledWith(['c', 'b']);
      });
    });
  });
});