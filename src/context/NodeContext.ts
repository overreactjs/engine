import React from "react";
import { Prop, Position, UpdateFunction, RenderFunction, TickerFunction } from "../types";

type NodeContextProps = {
  debug?: boolean;
  pos?: Prop<Position>;
  registerTicker: (id: string, fn: TickerFunction) => void;
  registerUpdate: (id: string, fn: UpdateFunction) => void;
  registerRender: (id: string, fn: RenderFunction) => void;
}

export const NodeContext = React.createContext<NodeContextProps>({
  debug: false,
  pos: [0, 0],
  registerTicker: () => {},
  registerUpdate: () => {},
  registerRender: () => {},
});
