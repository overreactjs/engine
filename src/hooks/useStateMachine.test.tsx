import { describe, expect, it, vi } from 'vitest';
import { nextFrame, renderHook } from '../test';
import { Engine, World } from '../components';
import { useStateMachine } from './useStateMachine';

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <Engine><World>{children}</World></Engine>;
  };
};

describe('useStateMachine', () => {
  it('it calls the state function once each frame', () => {
    const idle = vi.fn();
    renderHook(() => useStateMachine({}, 'idle', { idle }), { wrapper: createWrapper() });

    expect(idle).not.toHaveBeenCalled();

    nextFrame();
    expect(idle).toHaveBeenCalledOnce();

    nextFrame();
    expect(idle).toHaveBeenCalledTimes(2);
  });
});
