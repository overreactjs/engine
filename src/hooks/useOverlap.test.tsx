import { describe, expect, it, vi } from "vitest";
import { useOverlap } from "../hooks";
import { nextFrame, renderHook } from "../test";
import { CollisionBox, Engine, World } from "../components";

describe('useOverlap', () => {
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

  describe('when two colliders are overlapping', () => {
    describe('and it is the first frame they have been overlapping', () => {
      it('the first time flag is true', () => {
        const callback = vi.fn();
        renderHook(() => useOverlap('test', callback), { wrapper: createWrapper() });

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
    });

    describe('and they have been overlapping for multiple frames', () => {
      it('the first time flag is true', () => {
        const callback = vi.fn();
        renderHook(() => useOverlap('test', callback), { wrapper: createWrapper() });

        expect(callback).not.toHaveBeenCalled();
        nextFrame();
        nextFrame();
        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenLastCalledWith(
          [
            expect.objectContaining({
              firstTime: false,
            }),
          ],
          expect.any(Number), // the time delta
        );
      });
    });

    describe('when one of the colliders is inactive', () => {
      describe('when the primary collider is inactive', () => {
        it('filters out inactive collisions', () => {
          const callback = vi.fn();
          renderHook(() => useOverlap('test', callback), {
            wrapper: createWrapper(
              <>
                <CollisionBox id="test" pos={[0, 0]} size={[100, 100]} active={false} />
                <CollisionBox pos={[50, 50]} size={[100, 100]} />
              </>
            ),
          });

          expect(callback).not.toHaveBeenCalled();
          nextFrame();
          expect(callback).toHaveBeenCalledOnce();
          expect(callback).toHaveBeenCalledWith([], expect.any(Number));
        });
      });

      describe('when the secondary collider is inactive', () => {
        it('filters out inactive collisions', () => {
          const callback = vi.fn();
          renderHook(() => useOverlap('test', callback), {
            wrapper: createWrapper(
              <>
                <CollisionBox id="test" pos={[0, 0]} size={[100, 100]} />
                <CollisionBox pos={[50, 50]} size={[100, 100]} active={false} />
              </>
            ),
          });

          expect(callback).not.toHaveBeenCalled();
          nextFrame();
          expect(callback).toHaveBeenCalledOnce();
          expect(callback).toHaveBeenCalledWith([], expect.any(Number));
        });
      });
    });

    describe('when a collider is tagged', () => {
      it('includes the tags in the collisions', () => {
        const callback = vi.fn();
        renderHook(() => useOverlap('test', callback), {
          wrapper: createWrapper(
            <>
              <CollisionBox id="test" pos={[0, 0]} size={[100, 100]} />
              <CollisionBox pos={[50, 50]} size={[100, 100]} tags={['enemy']} />
            </>
          ),
        });

        expect(callback).not.toHaveBeenCalled();
        nextFrame();
        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenLastCalledWith(
          [
            expect.objectContaining({
              tags: ['enemy'],
            }),
          ],
          expect.any(Number), // the time delta
        );
      });
    });
  });
});