import { useMergeProperty, useProperty, useSync } from "../../hooks";
import { Tileset, Prop, Position } from "../../types";
import { CollisionBox } from "../CollisionBox";

type TilemapCollisionProps = {
  index: number;
  tags: string[] | false;
  tileset: Tileset;
  active: Prop<boolean>;
  offset: Prop<Position>;
};

export const TilemapCollision = ({ tileset, ...props }: TilemapCollisionProps) => {
  const { cellSize, gridSize } = tileset;

  const index = useProperty(props.index);
  const tags = useProperty(props.tags || []);

  const active = useProperty(props.active);
  const tileActive = useMergeProperty(active, tags, (active, tags) => active && tags.length > 0);
  const show = useSync(() => tileActive.current);

  const offset = useProperty(props.offset);
  const pos = useMergeProperty(index, offset, (index, offset): Position => [
    offset[0] + (index % gridSize[0]) * cellSize[0],
    offset[1] + Math.floor(index / gridSize[0]) * cellSize[1],
  ]);

  return show && <CollisionBox pos={pos} size={cellSize} tags={tags} />;
};
