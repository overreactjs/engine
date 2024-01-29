import React from "react";

type VirtualInputContextProps = {
  simulate: (action: string) => void;
  isActive: (action: string) => boolean;
  hasAxis: (negative: string, positive: string) => number;
};

export const VirtualInputContext = React.createContext<VirtualInputContextProps>({
  simulate: () => {},
  isActive: () => false,
  hasAxis: () => 0,
});
