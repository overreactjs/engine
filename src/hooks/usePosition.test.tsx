import { describe, expect, it } from 'vitest';
import { renderHook } from '../test';
import { Node } from '../components';
import { Position, Prop } from '../types';
import { VariableProperty } from '../utils';
import { usePosition } from './usePosition';

const createWrapper = ({ pos }: { pos?: Prop<Position> }) => {
  return ({ children }: { children: React.ReactNode }) => {
    return <Node pos={pos}>{children}</Node>;
  };
};

describe('usePosition', () => {
  describe('when it is not wrapped in a node', () => {
    it('uses the given position', () => {
      const { result } = renderHook(() => usePosition([300, 200]));
      expect(result.current.current).toEqual([300, 200]);
    });

    it('defaults to [0, 0]', () => {
      const { result } = renderHook(() => usePosition());
      expect(result.current.current).toEqual([0, 0]);
    });
  });
  
  describe('when it is wrapped in a node', () => {
    describe('and no position is given', () => {
      it('inherits position from the node', () => {
        const pos = new VariableProperty<Position>([100, 50]);
        const { result } = renderHook(() => usePosition(), { wrapper: createWrapper({ pos })});
        expect(result.current.current).toEqual([100, 50]);

        pos.current = [200, 300];
        expect(result.current.current).toEqual([200, 300]);
      });
    });

    describe('and a position is given', () => {
      it('uses the given position', () => {
        const { result } = renderHook(() => usePosition([300, 200]), { wrapper: createWrapper({ pos: [100, 50] })});
        expect(result.current.current).toEqual([300, 200]);
      });
    });
  });
});
