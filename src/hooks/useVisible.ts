import { useContext } from "react";
import { NodeContext } from "../context";
import { Prop } from "../types";
import { useProperty } from "./useProperty";

export const useVisible = (value?: Prop<boolean>) => {
  const parent = useContext(NodeContext);
  const isVisible = value === undefined ? (parent.visible === undefined ? true : parent.visible) : value;
  return useProperty<boolean>(isVisible);
};
