import React from "react";

type EngineContextProps = {
  debug: boolean;
  onDebug: () => void;
  onPause: () => void;
}

export const EngineContext = React.createContext<EngineContextProps>({
  debug: false,
  onDebug: () => {},
  onPause: () => {},
});
