import { describe, expect, it, vi } from "vitest";
import { useCollision, useTaggedCollision } from "../hooks";
import { nextFrame, renderHook } from "../test";
import { CollisionBox, Engine, World } from "../components";
import { Position } from "../types";
import { VariableProperty } from "../utils";

const createWrapper = (colliders?: React.ReactNode) => {
  return ({ children }: { children: React.ReactNode }) => {
    return (
      <Engine>
        <World>
          {colliders ? colliders : (
            <>
              <CollisionBox id="test" pos={[0, 0]} size={[100, 100]} />
              <CollisionBox pos={[50, 50]} size={[100, 100]} />
            </>
          )}
          {children}
        </World>
      </Engine>
    );
  };
};

describe('useCollision', () => {
  describe('when two colliders collide', () => {
    it('calls the callback', () => {
      const callback = vi.fn();
      renderHook(() => useCollision('test', callback), { wrapper: createWrapper() });

      expect(callback).not.toHaveBeenCalled();
      nextFrame();
      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(
        [
          expect.objectContaining({
            a: expect.objectContaining({ // the 'test' collider
              bbox: { minX: 0, minY: 0, maxX: 100, maxY: 100 }
            }),
            b: expect.objectContaining({ // the other collider
              bbox: { minX: 50, minY: 50, maxX: 150, maxY: 150 }
            }),
            firstTime: true,
            tags: [],
            overlap: {
              x: -0,
              y: 50,
            },
          }),
        ],
        expect.any(Number), // the time delta
      );
    });

    describe('and they have been overlapping for multiple frames', () => {
      it('calls the callback only once', () => {
        const callback = vi.fn();
        renderHook(() => useCollision('test', callback), { wrapper: createWrapper() });

        expect(callback).not.toHaveBeenCalled();
        nextFrame();
        nextFrame();
        expect(callback).toHaveBeenCalledOnce();
      });
    });

    describe('when they no longer collide, then begin colliding again', () => {
      it('calls the callback a second time', () => {
        const callback = vi.fn();
        const pos = new VariableProperty<Position>([0, 0]);
        renderHook(() => useCollision('test', callback), {
          wrapper: createWrapper(
            <>
              <CollisionBox id="test" pos={pos} size={[100, 100]} />
              <CollisionBox pos={[50, 50]} size={[100, 100]} />
            </>
          ),
        });

        nextFrame();
        expect(callback).toHaveBeenCalledOnce();

        pos.current = [-100, 0]; // so it no longer collides
        nextFrame();
        expect(callback).toHaveBeenCalledOnce();

        pos.current = [0, 0]; // so it collides once again
        nextFrame();
        expect(callback).toHaveBeenCalledTimes(2);
      });
    });
  });
});

describe('useTaggedCollision', () => {
  describe('when colliders collide', () => {
    it('filters out other tags', () => {
      const callback = vi.fn();
      const pos = new VariableProperty<Position>([0, 0]);
      renderHook(() => useTaggedCollision('test', 'coin', callback), {
        wrapper: createWrapper(
          <>
            <CollisionBox id="test" pos={pos} size={[100, 100]} />
            <CollisionBox pos={[50, 50]} size={[100, 100]} tags={['enemy']} />
            <CollisionBox pos={[-50, 50]} size={[100, 100]} tags={['coin']} />
          </>
        ),
      });

      nextFrame();
      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(
        [
          expect.objectContaining({
            a: expect.objectContaining({ // the 'test' collider
              bbox: { minX: 0, minY: 0, maxX: 100, maxY: 100 }
            }),
            b: expect.objectContaining({ // the 'coin' collider
              bbox: { minX: -50, minY: 50, maxX: 50, maxY: 150 }
            }),
            firstTime: true,
            tags: ['coin'],
            overlap: {
              x: -0,
              y: 50,
            },
          }),
        ],
        expect.any(Number), // the time delta
      );
    });
  });
});
