import { useContext } from "react";
import { ViewportContext } from "../components";

export const useViewport = () => {
  return useContext(ViewportContext);
}
  