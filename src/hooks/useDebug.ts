import { useContext } from "react";
import { EngineContext } from "../context";
import { Property } from "../types";

export const useDebug = (): Property<boolean> => {
  const { debug } = useContext(EngineContext);
  return debug;
}
