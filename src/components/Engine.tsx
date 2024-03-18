import { useMemo, useRef, useCallback, useEffect, useLayoutEffect, MutableRefObject } from "react";
import { EngineContext, NodeContext } from "../context";
import { useNode, useProperty } from "../hooks";
import { Validator } from "../utils";
import { Gamepad } from "./Gamepad";
import { Keyboard } from "./Keyboard";
import { Motion } from "./Motion";
import { Orientation } from "./Orientation";
import { Pointer } from "./Pointer";
import { VirtualInput } from "./VirtualInput";

const MAX_DELTA = 1000 / 15;

type EngineProps = {
  children: React.ReactNode;
}

/**
 * Engine
 * ------
 * 
 * Provides a game loop, ensuring updates are made at a constant frame rate.
 */
export const Engine: React.FC<EngineProps> = ({ children }) => {
  const started = useRef(false);
  const paused = useRef(true);
  const time = useRef<number>(0);
  const debug = useProperty(false);
  const node = useNode();

  const onPause = useCallback(() => paused.current = !paused.current, []);
  const onDebug = useCallback(() => {
    debug.current = !debug.current;
    document.body.classList[debug.current ? 'add' : 'remove']('debug');
  }, []);

  // Automatically pause and unpause the engine as the page lose and gains visibility.
  usePauseOnPageHidden(paused);

  // Handle one tick of the game loop.
  const tick = useCallback((t: number) => {
    requestAnimationFrame(tick);

    // Limit the time delta, to avoid strange happenings!
    const delta = Math.min(t - time.current, MAX_DELTA);
    time.current = t;

    // The ticker phase runs even when the engine is paused.
    node.ticker(delta, t);

    // The update phase only runs when the engine is running.
    if (!paused.current) node.update(delta, t);
    
    // The render phase always runs.
    node.render();

    // Revalidate all properties that were previously invalidated.
    Validator.run();
  }, [node]);

  // Start the game loop.
  useEffect(() => {
    if (!started.current) {
      started.current = true;
      setTimeout(onPause, 100);
      tick(0);
    }
  }, [tick]);

  const engineContext = useMemo(() => ({ debug, onDebug, onPause }), [debug, onDebug, onPause]);

  return (
    <EngineContext.Provider value={engineContext}>
      <NodeContext.Provider value={node}>
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
  }, []);

  useLayoutEffect(() => {
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);
};