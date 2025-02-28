import { useMemo, useRef, useCallback, useEffect, useLayoutEffect, MutableRefObject } from "react";
import { EngineContext, NodeContext } from "../context";
import { useNode, useProperty } from "../hooks";
import { SlidingWindow, Validator } from "../utils";
import { AudioEngine } from "./AudioEngine";
import { Gamepad } from "./Gamepad";
import { Keyboard } from "./Keyboard";
import { Motion } from "./Motion";
import { Orientation } from "./Orientation";
import { Pointer } from "./Pointer";
import { VirtualInput } from "./VirtualInput";

type EngineProps = {
  children: React.ReactNode;
  minFrameRate?: number;
}

/**
 * Engine
 * ------
 * 
 * Provides a game loop, ensuring updates are made at a constant frame rate.
 */
export const Engine: React.FC<EngineProps> = ({ children, minFrameRate }) => {
  const maxDelta = 1000 / (minFrameRate || 15);

  const fps = useProperty(new SlidingWindow(30));
  const ups = useProperty(new SlidingWindow(30));

  const started = useRef(false);
  const paused = useRef(true);
  const time = useRef<number>(0);
  const debug = useProperty(false);
  const node = useNode();

  const onPause = useCallback(() => paused.current = !paused.current, []);
  const onDebug = useCallback(() => {
    debug.current = !debug.current;
    document.body.classList[debug.current ? 'add' : 'remove']('debug');
  }, [debug]);

  // Automatically pause and unpause the engine as the page lose and gains visibility.
  usePauseOnPageHidden(paused);

  // Handle one tick of the game loop.
  const tick = useCallback((t: number) => {
    requestAnimationFrame(tick);
    const start = performance.now();

    // Limit the time delta, to avoid strange happenings!
    const rawDelta = t - time.current;
    const delta = Math.min(rawDelta, maxDelta);
    time.current = t;

    // The ticker phase runs even when the engine is paused.
    node.ticker(delta, t);

    // The update phase only runs when the engine is running.
    if (!paused.current) node.update(delta, t);
    
    // The render phase always runs.
    node.render();

    // Revalidate all properties that were previously invalidated.
    Validator.run();

    // Update the FPS/UPS counts.
    fps?.current.push(1000 / rawDelta);
    ups?.current.push(1000 / (performance.now() - start));
  }, [fps, maxDelta, node, ups]);

  // Start the game loop.
  useEffect(() => {
    if (!started.current) {
      started.current = true;
      setTimeout(onPause, 100);
      tick(0);
    }
  }, [onPause, tick]);

  const engineContext = useMemo(() => ({ debug, onDebug, onPause, fps, ups }), [debug, fps, onDebug, onPause, ups]);

  return (
    <EngineContext.Provider value={engineContext}>
      <NodeContext.Provider value={node}>
        <AudioEngine>
          <VirtualInput>
            <Gamepad>
              <Keyboard>
                <Pointer>
                  <Motion>
                    <Orientation>
                      {children}
                    </Orientation>
                  </Motion>
                </Pointer>
              </Keyboard>
            </Gamepad>
          </VirtualInput>
        </AudioEngine>
      </NodeContext.Provider>
    </EngineContext.Provider>
  );
};

/**
 * Listen for page visibility change events, pausing and unpausing the engine accordingly.
 */
const usePauseOnPageHidden = (paused: MutableRefObject<boolean>) => {
  const onVisibilityChange = useCallback(() => {
    if (document.hidden) {
      paused.current = true;
    } else {
      setTimeout(() => paused.current = false, 500);
    }
  }, [paused]);

  useLayoutEffect(() => {
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [onVisibilityChange]);
};