import { useState } from "react";
import { Size } from "../../types";
import { Tiles } from "./Tiles";

export const useTiles = (size: Size, init: () => number = () => -1) => {
  const [tiles] = useState(new Tiles(size, init));
  return tiles;
};
