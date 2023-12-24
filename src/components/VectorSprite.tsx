import { useLayoutEffect } from "react";
import { useElement, usePosition, useProperty, useRender, useSpriteSet, useUpdate } from "../hooks";
import { Position, Prop, Size } from "../types";
import { Node } from "./Node";

/**
 * VectorSprite
 * -----
 * 
 * ...
 */

type VectorSpriteProps = {
  name: string;
  sprite: React.FC<React.SVGProps<SVGSVGElement>>;
  pos?: Prop<Position>;
  size: Prop<Size>;
};

export const VectorSprite: React.FC<VectorSpriteProps> = ({ sprite: Sprite, ...props }) => {
  const element = useElement<SVGSVGElement>();

  const pos = usePosition(props.pos);
  const size = useProperty<Size>(props.size);
  const frameCount = useProperty<number>(1);
  const frameRate = useProperty<number>(10);
  const frameWidth = useProperty<number>(100);
  const frameHeight = useProperty<number>(100);
  const frameIndex = useProperty<number>(0);
  const frameTime = useProperty<number>(0);

  // Pull the sprite parameters (frame rate, number of frame, and frame size) from the SVG element.
  useLayoutEffect(() => {
    const { frames, rate, width, height } = element.ref.current?.dataset || {};
    frameWidth.current = parseInt(width || '100', 10);
    frameHeight.current = parseInt(height || '100', 10);
    frameRate.current = parseInt(rate || '10', 10);
    frameCount.current = parseInt(frames || '1', 10);
  }, [element.ref, frameCount, frameHeight, frameRate, frameWidth]);

  useSpriteSet(props.name, element.ref, () => {
    frameIndex.current = 0;
  });

  useUpdate((delta) => {
    frameTime.current += delta;
    
    const frameMillis = 1000 / frameRate.current;
    const frameIncrement = Math.floor(frameTime.current / frameMillis);

    frameIndex.current = (frameIndex.current + frameIncrement) % frameCount.current;
    frameTime.current -= frameIncrement * frameMillis;
  });

  useRender(() => {
    element.setBaseStyles({ pos, size });
    element.setStyle('position', 'absolute');
    element.setStyle('contain', 'content');

    const viewBox = `${frameIndex.current * frameWidth.current} 0 ${frameWidth.current} ${frameHeight.current}`;
    element.ref.current?.setAttribute('viewBox', viewBox);
  });

  return (
    <Node pos={pos}>
      <Sprite ref={element.ref} style={{ userSelect: 'none' }} />
    </Node>
  );
};
