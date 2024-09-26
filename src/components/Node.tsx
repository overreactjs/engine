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
  visible?: Prop<boolean>;
  pos?: Prop<Position>;
  offset?: Prop<Position>;
  rounded?: boolean;
  timeScale?: Prop<number>;
  name?: string;
}

export const Node: React.FC<NodeProps> = ({ name, children, timeScale, rounded, ...props }) => {
  const parent = useContext(NodeContext);
  const isVisible = props.visible === undefined ? (parent.visible === undefined ? true : parent.visible) : props.visible;
  const visible = useProperty<boolean>(isVisible);
  const pos = useProperty<Position>(props.pos || parent.pos || [0, 0]);
  const offsetPos = useOffsetPosition(pos, props.offset || [0, 0]);
  const roundedPos = useIntegerPosition(offsetPos);
  const node = useNode({ name, timeScale });

  const context = useMemo(() => ({
    ...node,
    debug: parent.debug,
    pos: rounded ? roundedPos : offsetPos,
    visible,
    name,
  }), [name, node, offsetPos, parent.debug, rounded, roundedPos, visible]);

  return <NodeContext.Provider value={context}>{children}</NodeContext.Provider>;
};
