import { usePosition, useProperty } from "../../hooks";
import { Position, Prop, Size, Tileset } from "../../types";
import { Box } from "../Box";
import { Tiles } from "./Tiles";
import { TilemapTile } from "./TilemapTile";
import { TilemapCollision } from "./TilemapCollision";

type TilemapProps = {
  pos?: Prop<Position>;
  tileset: Tileset;
  tiles: Tiles | number[];
  collisions?: (string[] | false)[];
  scale?: Prop<number>;
  active?: Prop<boolean>;
}

/**
 * Tilemap
 * -------
 * 
 * ...
 */
export const Tilemap = ({ tileset, tiles, collisions, ...props }: TilemapProps) => {
  const { cellSize, tileSize, gridSize } = tileset;

  const pos = usePosition(props.pos);
  const size = useProperty<Size>([gridSize[0] * cellSize[0], gridSize[1] * cellSize[0]]);
  const factor = useProperty<Size>([cellSize[0] / tileSize[0], cellSize[1] / tileSize[1]]);
  const active = useProperty(props.active !== undefined ? props.active : true);
  
  return (
    <Box pos={pos} size={size}>
      {tiles.map((tile, index) => (
        <TilemapTile key={index} index={index} tile={tile} tileset={tileset} factor={factor} />
      ))}
      {collisions?.map((tags, index) => (
        <TilemapCollision key={index} index={index} tags={tags} tileset={tileset} active={active} offset={pos} />
      ))}
    </Box>
  )
};
