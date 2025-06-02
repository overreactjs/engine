import React from "react";
import { Property, SlidingWindow } from "..";

export type EngineContextProps = {
  debug: Property<boolean>;
  onDebug: () => void;
  onPause: () => void;
  fps: Property<SlidingWindow>;
  ups: Property<SlidingWindow>;
}

export const EngineContext = React.createContext<EngineContextProps>({
  debug: { current: false, invalidated: true, listen: () => () => {} },
  onDebug: () => {},
  onPause: () => {},
  fps: { current: new SlidingWindow(30), invalidated: true, listen: () => () => {} },
  ups: { current: new SlidingWindow(30), invalidated: true, listen: () => () => {} },
});
