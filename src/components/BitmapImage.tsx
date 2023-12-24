import { Node } from '../components';
import { usePosition, useProperty, useRender } from "../hooks";
import { UseElementResult, useElement } from "../hooks/useElement";
import { BitmapAsset, Position, Prop, Size } from "../types";

type BitmapImageProps = {
  element?: UseElementResult<HTMLDivElement>;
  image: Prop<BitmapAsset>;
  pos?: Prop<Position>;
  size: Prop<Size>;
  offset: Prop<Position>;
  flip?: Prop<boolean>;
  scale?: Prop<number>;
}

/**
 * BitmapImage
 * -----------
 * 
 * Render part of a bitmap image. The image is shown an a background image, sized and cropped as
 * required.
 */
export const BitmapImage: React.FC<BitmapImageProps> = (props) => {
  const element = useElement<HTMLDivElement>(props.element);

  const image = useProperty(props.image);
  const pos = usePosition(props.pos);
  const size = useProperty(props.size);
  const flip = useProperty(props.flip || false);
  const offset = useProperty(props.offset);
  const scale = useProperty(props.scale || 1);

  useRender(() => {
    const width = image.current.size[0] * scale.current;
    const height = image.current.size[1] * scale.current;

    element.setBaseStyles({ pos, size, flip });
    element.setStyle('imageRendering', 'pixelated');
    element.setStyle('backgroundImage', `url(${image.current.url})`);
    element.setStyle('backgroundSize', `${width}px ${height}px`);
    element.setStyle('backgroundPosition', `${-offset.current[0]}px ${-offset.current[1]}px`);
  });

  return (
    <Node pos={pos}>
      <div ref={element.ref} className="absolute bg-no-repeat" />
    </Node>
  )
};
