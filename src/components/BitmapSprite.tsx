import { useElement, usePosition, useProperty, useSpriteSet, useUpdate, useVisible } from "../hooks";
import { BitmapSpriteAsset, BaseStyleProps, Position, Size } from "../types";
import { BitmapImage } from "./BitmapImage";

export type BitmapSpriteProps = BaseStyleProps & {
  name?: string;
  sprite: BitmapSpriteAsset;
  repeat?: boolean;
};

/**
 * BitmapSprite
 * ------------
 * 
 * Animate a bitmap sprite by changing the offset of the background position, based on the number
 * of frames and the frame rate.
 */
export const BitmapSprite: React.FC<BitmapSpriteProps> = ({ sprite, ...props }) => {
  const element = useElement<HTMLDivElement>();

  const pos = usePosition(props.pos);
  const size = useProperty(props.size);
  const flip = useProperty(props.flip || false);
  const angle = useProperty(props.angle || 0);
  const scale = useProperty(props.scale || 1);
  const visible = useVisible(props.visible);

  const repeat = useProperty(props.repeat === undefined ? true : props.repeat);
  const frameWidth = useProperty<number>(sprite.size[0] / sprite.count);
  const frameIndex = useProperty<number>(0);
  const frameTime = useProperty<number>(0);
  const offset = useProperty<Position>([0, 0]);
  const factor = useProperty<Size>([size.current[0] / frameWidth.current, size.current[1] / sprite.size[1]]);

  useSpriteSet(props.name, element.ref, () => {
    frameIndex.current = 0;
  });

  useUpdate((delta) => {
    frameTime.current += delta;
    
    const frameMillis = 1000 / sprite.rate;
    const frameIncrement = Math.floor(frameTime.current / frameMillis);

    frameIndex.current = frameIndex.current + frameIncrement;

    if (repeat.current) {
      frameIndex.current = frameIndex.current % sprite.count;
    }

    frameIndex.current = Math.min(sprite.count - 1, frameIndex.current);
    frameTime.current -= frameIncrement * frameMillis;

    if (element.ref.current?.style.display !== 'none') {
      offset.current[0] = frameIndex.current * frameWidth.current;
    }
  });

  return (
    <BitmapImage
      element={element}
      image={sprite}
      pos={pos}
      size={size}
      factor={factor}
      scale={scale}
      offset={offset}
      flip={flip}
      angle={angle}
      visible={visible}
    />
  );
};
