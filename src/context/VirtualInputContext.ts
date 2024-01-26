import React from "react";

type VirtualInputContextProps = {
  simulate: (what: string) => void;
  isActive: (what: string) => boolean;
  hasAxis: (negative: string, positive: string) => number;
};

export const VirtualInputContext = React.createContext<VirtualInputContextProps>({
  simulate: () => {},
  isActive: () => false,
  hasAxis: () => 0,
});
