import React, { useContext, useMemo } from "react";
import { useProperty, useNode, useOffsetPosition, useIntegerPosition } from "../hooks";
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
  offset?: Prop<Position>;
  rounded?: boolean;
  timeScale?: Prop<number>;
  name?: string;
}

export const Node: React.FC<NodeProps> = ({ name, children, timeScale, rounded, ...props }) => {
  const parent = useContext(NodeContext);
  const pos = useProperty<Position>(props.pos || parent.pos || [0, 0]);
  const offsetPos = useOffsetPosition(pos, props.offset || [0, 0]);
  const roundedPos = useIntegerPosition(offsetPos);
  const node = useNode({ name, timeScale });

  const context = useMemo(() => ({
    ...node,
    debug: parent.debug,
    pos: rounded ? roundedPos : offsetPos,
    name,
  }), [node, parent.debug, pos]);

  return <NodeContext.Provider value={context}>{children}</NodeContext.Provider>;
};
