import React, { useContext } from "react";
import { useElement, useProperty, useRender } from "../hooks";
import { EngineContext } from "../context";

/**
 * FrameRate
 * ---------
 * 
 * Show the current FPS in the top right of the device.
 */
export const FrameRate: React.FC = () => {
  const fpsElement = useElement();
  const { fps, ups } = useContext(EngineContext);

  const next = useProperty(0);

  useRender(() => {
    if (next.current === 0) {
      const fpsStr = fps.current.mean().toFixed(0) + ' fps';
      const upsStr = ups.current.mean().toFixed(0) + ' ups';
      fpsElement.setText([fpsStr, upsStr].join('\n'));
      next.current = 10;
    }

    next.current--;
  });

  return (
    <div className="absolute top-8 right-8 mix-blend-difference text-white">
      <div className="tabular-nums whitespace-pre text-right" ref={fpsElement.ref} />
    </div>
  );
};