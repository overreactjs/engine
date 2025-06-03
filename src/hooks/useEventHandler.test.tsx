import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '../test';
import { useEventListeners } from "./useEventListeners";
import { useEventHandler } from './useEventHandler';

describe('useEventHandler', () => {
  describe('when an event is fired', () => {
    describe('and there is a listener', () => {
      it('calls the listener', () => {
        const listener = vi.fn();
        const target = renderHook(() => useEventListeners<'jump'>()).result.current;
        renderHook(() => useEventHandler(target, 'jump', listener));
    
        target.fireEvent('jump', undefined);
        expect(listener).toBeCalledTimes(1);
        expect(listener).toBeCalledWith(undefined);
      });
    });

    describe('but there is no listener', () => {
      describe('when a listener is registered', () => {
        it('calls the listener', () => {
          const listener = vi.fn();
          const target = renderHook(() => useEventListeners<'jump'>()).result.current;
          
          target.fireEvent('jump', undefined);
          expect(listener).not.toBeCalled();

          renderHook(() => useEventHandler(target, 'jump', listener));
          expect(listener).toBeCalledTimes(1);
          expect(listener).toBeCalledWith(undefined);
        });
      });
    });
  });
});
