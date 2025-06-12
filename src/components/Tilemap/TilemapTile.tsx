import { useProperty, useCachedDynamicProperty, useDynamicProperty, useSync } from "../../hooks";
import { Prop, Tileset, Size, Position } from "../../types";
import { BitmapImage } from "../BitmapImage";

type TilemapTileProps = {
  index: number;
  tile: Prop<number>;
  tileset: Tileset;
  factor?: Prop<Size>;
};

export const TilemapTile = ({ tileset, ...props }: TilemapTileProps) => {
  const { image, cellSize, tileSize, gridSize } = tileset;
  const tilesetCols = Math.floor(image.size[0] / tileSize[0]);

  const index = useProperty(props.index);
  const tile = useProperty(props.tile);
  const factor = useProperty<Size>(props.factor || [1, 1]);

  const pos = useCachedDynamicProperty(index, (index): Position => [
    (index % gridSize[0]) * cellSize[0],
    Math.floor(index / gridSize[0]) * cellSize[1],
  ]);

  const offset = useDynamicProperty(tile, (tile): Position => [
    (tile % tilesetCols) * tileSize[0],
    Math.floor(tile / tilesetCols) * tileSize[1],
  ]);

  const visible = useSync(() => tile.current >= 0);

  return visible && <BitmapImage pos={pos} offset={offset} image={image} size={cellSize} factor={factor} />;
};
