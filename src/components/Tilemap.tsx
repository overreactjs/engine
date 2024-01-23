import { CollisionBox } from ".";
import { usePosition, useProperty } from "../hooks";
import { Position, Prop, Size, Tileset } from "../types";
import { BitmapImage } from "./BitmapImage";
import { Box } from "./Box";

type TilemapProps = {
  pos?: Prop<Position>;
  tileset: Tileset;
  tiles: number[];
  collisions?: (string | false)[];
  scale?: Prop<number>;
}

/**
 * Tilemap
 * -------
 * 
 * ...
 */
export const Tilemap: React.FC<TilemapProps> = ({ tileset, tiles, collisions, ...props }) => {
  const { image, cellSize, gridSize } = tileset;

  const pos = usePosition(props.pos);
  const size = useProperty<Size>([gridSize[0] * cellSize[0], gridSize[1] * cellSize[1]]);
  const scale = useProperty(props.scale || 1);

  const tilesetCols = Math.floor((image.size[0] * scale.current) / cellSize[0]);
  
  return (
    <Box pos={pos} size={size}>
      {tiles.map((tile, index) => {
        if (tile >= 0) {
          const key = `${index}_${tile}`;
          const x = (index % gridSize[0]) * cellSize[0];
          const y = Math.floor(index / gridSize[0]) * cellSize[1];
          const ox = (tile % tilesetCols) * cellSize[0];
          const oy = Math.floor(tile / tilesetCols) * cellSize[1];
          return <BitmapImage key={key} pos={[x, y]} offset={[ox, oy]} image={image} size={cellSize} scale={scale} />;
        } else {
          return null;
        }
      })}
      {collisions?.map((tag, index) => {
        if (tag) {
          const key = `${index}_${tag}`;
          const x = (index % gridSize[0]) * cellSize[0];
          const y = Math.floor(index / gridSize[0]) * cellSize[1];
          return <CollisionBox key={key} pos={[x, y]} size={cellSize} tags={[tag]} />;
        } else {
          return null;
        }
      })}
    </Box>
  )
};
