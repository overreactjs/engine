import { Node } from '../components';
import { useBaseStyleProperties, useProperty, useRender } from "../hooks";
import { UseElementResult, useElement } from "../hooks/useElement";
import { BitmapAsset, BaseStyleProps, Position, Prop, Size } from "../types";

export type BitmapImageProps = BaseStyleProps & {
  element?: UseElementResult<HTMLDivElement>;
  image: Prop<BitmapAsset>;
  offset: Prop<Position>;
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

  const base = useBaseStyleProperties(props);
  const image = useProperty(props.image);
  const offset = useProperty(props.offset);
  const factor = useProperty(props.factor || [1, 1]);

  useRender(() => {
    element.setBaseStyles(base);

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
    <Node pos={base.pos}>
      <div ref={element.ref} className="absolute bg-no-repeat" style={{ imageRendering: 'pixelated' }} />
    </Node>
  )
};
