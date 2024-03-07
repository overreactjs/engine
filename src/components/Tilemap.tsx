import { CollisionBox } from ".";
import { usePosition, useProperty } from "../hooks";
import { Position, Prop, Size, Tileset } from "../types";
import { BitmapImage } from "./BitmapImage";
import { Box } from "./Box";

type TilemapProps = {
  pos?: Prop<Position>;
  tileset: Tileset;
  tiles: number[];
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
export const Tilemap: React.FC<TilemapProps> = ({ tileset, tiles, collisions, ...props }) => {
  const { image, cellSize, tileSize, gridSize } = tileset;

  const pos = usePosition(props.pos);
  const size = useProperty<Size>([gridSize[0] * cellSize[0], gridSize[1] * cellSize[0]]);
  const active = useProperty(props.active !== undefined ? props.active : true);
  const factor = useProperty<Size>([cellSize[0] / tileSize[0], cellSize[1] / tileSize[1]]);

  const tilesetCols = Math.floor(image.size[0] / tileSize[0]);
  
  return (
    <Box pos={pos} size={size}>
      {tiles.map((tile, index) => {
        if (tile >= 0) {
          const key = `${index}_${tile}`;
          const x = (index % gridSize[0]) * cellSize[0];
          const y = Math.floor(index / gridSize[0]) * cellSize[1];
          const ox = (tile % tilesetCols) * tileSize[0];
          const oy = Math.floor(tile / tilesetCols) * tileSize[1];
          return <BitmapImage key={key} pos={[x, y]} offset={[ox, oy]} image={image} size={cellSize} factor={factor} />;
        } else {
          return null;
        }
      })}
      {collisions?.map((tags, index) => {
        if (tags) {
          const key = `${index}_${tags.join('_')}`;
          const x = pos.current[0] + (index % gridSize[0]) * cellSize[0];
          const y = pos.current[1] + Math.floor(index / gridSize[0]) * cellSize[0];
          return <CollisionBox key={key} pos={[x, y]} size={cellSize} tags={tags} active={active} />;
        } else {
          return null;
        }
      })}
    </Box>
  )
};
