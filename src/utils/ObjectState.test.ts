import { describe, expect, it } from 'vitest';
import { ObjectState } from './ObjectState';

describe('ObjectState', () => {
  it('begins the auto index at zero', () => {
    const state = new ObjectState();
    expect(state.id).toBe(0);
  });

  it('increments by one for each new object', () => {
    const state = new ObjectState();
    expect(state.id).toBe(1);
  });
});
