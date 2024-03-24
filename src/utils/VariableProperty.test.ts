import { describe, expect, it } from 'vitest';
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
});