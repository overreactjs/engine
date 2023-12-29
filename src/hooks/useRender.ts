import { useContext, useEffect, useId } from "react";
import { RenderFunction } from "../types";
import { NodeContext } from "../context";

export const useRender = (fn: RenderFunction): string => {
  const { registerRender } = useContext(NodeContext) || {};
  const id = useId();

  useEffect(() => registerRender?.(id, fn), [fn, id, registerRender]);

  return id;
}