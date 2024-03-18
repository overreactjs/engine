import { useContext } from "react";
import { GamepadContext } from "../context";

export const useGamepad = () => {
  return useContext(GamepadContext);
};
