import { useElement, usePosition, useProperty, useSpriteSet, useUpdate } from "../hooks";
import { BitmapSpriteAsset, Position, Prop, Size } from "../types";
import { BitmapImage } from "./BitmapImage";

type BitmapSpriteProps = {
  name?: string;
  sprite: Prop<BitmapSpriteAsset>;
  pos?: Prop<Position>;
  size: Prop<Size>;
  flip?: Prop<boolean>;
  repeat?: boolean;
};

/**
 * BitmapSprite
 * ------------
 * 
 * Animate a bitmap sprite by changing the offset of the background position, based on the number
 * of frames and the frame rate.
 */
export const BitmapSprite: React.FC<BitmapSpriteProps> = (props) => {
  const element = useElement<HTMLDivElement>();

  const sprite = useProperty(props.sprite);
  const pos = usePosition(props.pos);
  const size = useProperty(props.size);
  const flip = useProperty(props.flip || false);
  const scale = useProperty(size.current[1] / sprite.current.size[1]);
  const repeat = useProperty(props.repeat === undefined ? true : props.repeat);
  const frameWidth = useProperty<number>(sprite.current.size[0] * scale.current / sprite.current.count);
  const frameIndex = useProperty<number>(0);
  const frameTime = useProperty<number>(0);
  const offset = useProperty<Position>([0, 0]);

  useSpriteSet(props.name, element.ref, () => {
    frameIndex.current = 0;
  });

  useUpdate((delta) => {
    frameTime.current += delta;
    
    const frameMillis = 1000 / sprite.current.rate;
    const frameIncrement = Math.floor(frameTime.current / frameMillis);

    frameIndex.current = frameIndex.current + frameIncrement;

    if (repeat.current) {
      frameIndex.current = frameIndex.current % sprite.current.count;
    }

    frameIndex.current = Math.min(sprite.current.count - 1, frameIndex.current);
    frameTime.current -= frameIncrement * frameMillis;

    offset.current[0] = frameIndex.current * frameWidth.current;
  });

  return <BitmapImage element={element} image={sprite} pos={pos} size={size} scale={scale} offset={offset} flip={flip} />;
};
