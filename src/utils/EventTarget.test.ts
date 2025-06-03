import { describe, expect, it, vi } from 'vitest';
import { EventTarget } from './EventTarget';

describe('EventTarget', () => {
  describe('addEventListener', () => {
    describe('when the event target takes no payload', () => {
      describe('when an event is fired', () => {
        it('calls the listener', () => {
          const target = new EventTarget<'jump'>();
          const listener = vi.fn();
      
          target.addEventListener('jump', listener);
          expect(listener).not.toBeCalled();
      
          target.fireEvent('jump', undefined);
          expect(listener).toBeCalledTimes(1);
          expect(listener).toBeCalledWith(undefined);
        });
      });
    });

    describe('when the event target takes a payload', () => {
      describe('when an event is fired', () => {
        it('calls the listener', () => {
          const target = new EventTarget<'jump', { foo: string }>();
          const listener = vi.fn();
      
          target.addEventListener('jump', listener);
          expect(listener).not.toBeCalled();
      
          target.fireEvent('jump', { foo: 'bar' });
          expect(listener).toBeCalledTimes(1);
          expect(listener).toBeCalledWith({ foo: 'bar' });
        });
      });
    });    
  });

  describe('removeEventListener', () => {
    describe('when an event is fired', () => {
      it('does not call the listener', () => {
        const target = new EventTarget<'jump'>();
        const listener = vi.fn();
    
        target.addEventListener('jump', listener);
        expect(listener).not.toBeCalled();
    
        target.removeEventListener('jump', listener);
        target.fireEvent('jump', undefined);
        expect(listener).not.toBeCalled();
      });
    });
  });

  describe('when an event is fired but there are no listeners', () => {
    describe('when a listener is registered', () => {
      it('handles all previously uncaught events', () => {
        const target = new EventTarget<'jump'>();
        const listener = vi.fn();

        target.fireEvent('jump', undefined);
        expect(listener).not.toBeCalled();

        target.addEventListener('jump', listener);
        expect(listener).toBeCalledTimes(1);
      });
    });
  });
});