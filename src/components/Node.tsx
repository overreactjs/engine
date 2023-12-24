import React, { useContext, useMemo } from "react";
import { useProperty, useNode } from "../hooks";
import { Prop, Position } from "../types";
import { NodeContext } from "../context";

/**
 * Node
 * ----
 * 
 * ...
 */

type NodeProps = {
  children: React.ReactNode;
  pos?: Prop<Position>;
}

export const Node: React.FC<NodeProps> = (props) => {
  const parent = useContext(NodeContext);
  const pos = useProperty<Position>(props.pos || parent.pos || [0, 0]);
  const node = useNode();
  const context = useMemo(() => ({ ...node, debug: parent.debug, pos }), [node, parent.debug, pos]);

  return <NodeContext.Provider value={context}>{props.children}</NodeContext.Provider>;
};
