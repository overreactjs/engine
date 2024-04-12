import { describe, expect, it, vi } from "vitest";
import { StateMachine } from "./StateMachine";
import { StateDefinitions } from "../types";

describe('StateMachine', () => {
  const createSubject = (states?: StateDefinitions<unknown>) => {
    return new StateMachine({}, 'idle', {
      idle: vi.fn(),
      walk: vi.fn(),
      ...states,
    });
  };

  it('calls the correct state function', () => {
    const fsm = createSubject();
    fsm.update(10);
    expect(fsm.states.idle).toHaveBeenCalledOnce();
    expect(fsm.states.walk).not.toHaveBeenCalled();
  });

  describe('when the state function replaces the state', () => {
    it('begins calling the correct state function', () => {
      const idle = vi.fn<[StateMachine<unknown>]>().mockImplementation((fsm) => {
        if (fsm.age.current >= 15) {
          fsm.replace('walk');
        }
      });

      const fsm = createSubject({ idle });

      fsm.update(10); // age = 0
      expect(fsm.states.idle).toHaveBeenCalledTimes(1);
      expect(fsm.states.walk).toHaveBeenCalledTimes(0);

      fsm.update(10); // age = 10
      expect(fsm.states.idle).toHaveBeenCalledTimes(2);
      expect(fsm.states.walk).toHaveBeenCalledTimes(0);

      fsm.update(10); // age = 20, this causes the replace
      expect(fsm.states.idle).toHaveBeenCalledTimes(3);
      expect(fsm.states.walk).toHaveBeenCalledTimes(0);

      fsm.update(10); // age = 0
      expect(fsm.states.idle).toHaveBeenCalledTimes(3);
      expect(fsm.states.walk).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the state function replaces to the same state', () => {
    it('does not reset the state age counter', () => {
      const idle = vi.fn<[StateMachine<unknown>]>().mockImplementation((fsm) => {
        if (fsm.age.current >= 15) {
          fsm.replace('walk');
        } else {
          fsm.replace('idle');
        }
      });

      const fsm = createSubject({ idle });

      fsm.update(10); // age = 0
      expect(fsm.states.idle).toHaveBeenCalledTimes(1);
      expect(fsm.states.walk).toHaveBeenCalledTimes(0);

      fsm.update(10); // age = 10
      expect(fsm.states.idle).toHaveBeenCalledTimes(2);
      expect(fsm.states.walk).toHaveBeenCalledTimes(0);

      fsm.update(10); // age = 20, this causes the replace
      expect(fsm.states.idle).toHaveBeenCalledTimes(3);
      expect(fsm.states.walk).toHaveBeenCalledTimes(0);

      fsm.update(10); // age = 0
      expect(fsm.states.idle).toHaveBeenCalledTimes(3);
      expect(fsm.states.walk).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the state function pushes new state', () => {
    it('begins calling the correct state function', () => {
      const idle = vi.fn<[StateMachine<unknown>]>().mockImplementation((fsm) => {
        if (fsm.age.current >= 15) {
          fsm.push('walk');
        }
      });

      const fsm = createSubject({ idle });

      fsm.update(10); // age = 0
      expect(fsm.states.idle).toHaveBeenCalledTimes(1);
      expect(fsm.states.walk).toHaveBeenCalledTimes(0);

      fsm.update(10); // age = 10
      expect(fsm.states.idle).toHaveBeenCalledTimes(2);
      expect(fsm.states.walk).toHaveBeenCalledTimes(0);

      fsm.update(10); // age = 20, this causes the push
      expect(fsm.states.idle).toHaveBeenCalledTimes(3);
      expect(fsm.states.walk).toHaveBeenCalledTimes(0);

      fsm.update(10); // age = 0
      expect(fsm.states.idle).toHaveBeenCalledTimes(3);
      expect(fsm.states.walk).toHaveBeenCalledTimes(1);
    });

    describe('then when it pops', () => {
      it('reverts to calling the previous state function', () => {
        const idle = vi.fn().mockImplementation((fsm: StateMachine<unknown>) => {
          if (fsm.age.current >= 15) {
            fsm.push('walk');
          }
        });

        const walk = vi.fn().mockImplementation((fsm: StateMachine<unknown>) => {
          if (fsm.age.current >= 15) {
            fsm.pop();
          }
        });
  
        const fsm = createSubject({ idle, walk });
  
        fsm.update(10); // age = 0
        expect(fsm.states.idle).toHaveBeenCalledTimes(1);
        expect(fsm.states.walk).toHaveBeenCalledTimes(0);

        fsm.update(10); // age = 10
        expect(fsm.states.idle).toHaveBeenCalledTimes(2);
        expect(fsm.states.walk).toHaveBeenCalledTimes(0);

        fsm.update(10); // age = 20, this causes the push
        expect(fsm.states.idle).toHaveBeenCalledTimes(3);
        expect(fsm.states.walk).toHaveBeenCalledTimes(0);
  
        fsm.update(10); // age = 0
        expect(fsm.states.idle).toHaveBeenCalledTimes(3);
        expect(fsm.states.walk).toHaveBeenCalledTimes(1);
  
        fsm.update(10); // age = 10
        expect(fsm.states.idle).toHaveBeenCalledTimes(3);
        expect(fsm.states.walk).toHaveBeenCalledTimes(2);
  
        fsm.update(10); // age = 20, this causes the pop
        expect(fsm.states.idle).toHaveBeenCalledTimes(3);
        expect(fsm.states.walk).toHaveBeenCalledTimes(3);

        fsm.update(10); // age = 0
        expect(fsm.states.idle).toHaveBeenCalledTimes(4);
        expect(fsm.states.walk).toHaveBeenCalledTimes(3);
      });
    });
  });
});
