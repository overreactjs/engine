import React from "react";
import { useElement, useProperty, useRender, useUpdate } from "../hooks";
import { SlidingWindow } from "../utils";

/**
 * FrameRate
 * ---------
 * 
 * Show the current FPS in the top right of the device.
 */
export const FrameRate: React.FC = () => {
  const fpsElement = useElement();
  const fps = useProperty(new SlidingWindow(30));

  useUpdate((delta) => {
    fps.current.push(1000 / delta);
  });

  useRender(() => {
    fpsElement.setText(fps.current.mean().toFixed(0) + ' fps');
  });

  return (
    <div className="absolute top-8 right-8 mix-blend-difference text-white">
      <div className="tabular-nums" ref={fpsElement.ref} />
    </div>
  );
};