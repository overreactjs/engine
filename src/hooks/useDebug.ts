import { useContext } from "react";
import { EngineContext } from "../context";

export const useDebug = (): boolean => {
  const { debug } = useContext(EngineContext);
  return !!debug;
}
