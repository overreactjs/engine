import React from "react";
import { Property } from "..";

type EngineContextProps = {
  debug: Property<boolean>;
  onDebug: () => void;
  onPause: () => void;
}

export const EngineContext = React.createContext<EngineContextProps>({
  debug: { current: false, invalidated: true },
  onDebug: () => {},
  onPause: () => {},
});
