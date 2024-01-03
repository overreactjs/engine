import { useMemo, useRef, useCallback, useEffect, useState } from "react";
import { EngineContext, NodeContext } from "../context";
import { useNode } from "../hooks";
import { Validator } from "../utils";
import { Keyboard } from "./Keyboard";
import { Mouse } from "./Mouse";
import { Touch } from "./Touch";
import { Motion } from "./Motion";
import { Orientation } from "./Orientation";
import { Pointer } from "./Pointer";

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
  const [debug, setDebug] = useState(false);
  const node = useNode();

  const onPause = useCallback(() => paused.current = !paused.current, []);
  const onDebug = useCallback(() => setDebug((debug) => !debug), []);

  // Handle one tick of the game loop.
  const tick = useCallback((t: number) => {
    requestAnimationFrame(tick);

    const delta = t - time.current;
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

  useEffect(() => {
    if (debug) {
      document.body.classList.add('debug');
    } else {
      document.body.classList.remove('debug');
    }
  }, [debug]);

  const engineContext = useMemo(() => ({ debug, onDebug, onPause }), [debug, onDebug, onPause]);

  return (
    <EngineContext.Provider value={engineContext}>
      <NodeContext.Provider value={node}>
        <Keyboard>
          <Pointer>
            <Mouse>
              <Touch>
                <Motion>
                  <Orientation>
                    {children}
                  </Orientation>
                </Motion>
              </Touch>
            </Mouse>
          </Pointer>
        </Keyboard>
      </NodeContext.Provider>
    </EngineContext.Provider>
  );
};
