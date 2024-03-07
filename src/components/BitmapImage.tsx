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
  angle?: Prop<number>;
  factor?: Prop<Size>;
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
  const angle = useProperty(props.angle || 0);
  const factor = useProperty(props.factor || [1, 1]);

  useRender(() => {
    element.setBaseStyles({ pos, size, angle, flip, scale });

    if (image.invalidated) {
      element.setLegacyStyle('backgroundImage', `url(${image.current.url})`);
      image.invalidated = false;
    }

    if (offset.invalidated || factor.invalidated) {
      const x = -offset.current[0] * factor.current[0];
      const y = -offset.current[1] * factor.current[1];
      element.setLegacyStyle('backgroundPosition', `${x}px ${y}px`);
      offset.invalidated = false;
      factor.invalidated = false;
    }

    if (image.invalidated || factor.invalidated) {
      const width = image.current.size[0] * factor.current[0];
      const height = image.current.size[1] * factor.current[1];
      element.setLegacyStyle('backgroundSize', `${width}px ${height}px`);
      image.invalidated = false;
      factor.invalidated = false;
    }
  });

  return (
    <Node pos={pos}>
      <div ref={element.ref} className="absolute bg-no-repeat" style={{ imageRendering: 'pixelated' }} />
    </Node>
  )
};
