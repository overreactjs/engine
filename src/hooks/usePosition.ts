import { useContext } from "react";
import { useProperty } from "./useProperty";
import { Position, Prop } from "../types";
import { NodeContext } from "../context";

export const usePosition = (value?: Prop<Position>) => {
  const parent = useContext(NodeContext);
  const pos = useProperty<Position>(value || parent.pos || [0, 0]);
  return pos;
}