import { useContext, useId, useEffect } from "react";
import { UpdateFunction } from "../types";
import { NodeContext } from "../context";

export const useUpdate = (fn: UpdateFunction): string => {
  const { registerUpdate } = useContext(NodeContext) || {};
  const id = useId();

  useEffect(() => registerUpdate?.(id, fn), [fn, id, registerUpdate]);

  return id;
}

export const useUpdateAfter = (target: string, fn: UpdateFunction): string => {
  const { registerUpdate } = useContext(NodeContext) || {};
  const id = useId();

  useEffect(() => registerUpdate?.(id, fn, { after: target }), [fn, id, registerUpdate]);

  return id;
}