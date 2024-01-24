import { useId } from "react";
import { useDynamicProperty, useElement, usePosition, useProperty, useRender, useSync } from "../hooks";
import { BitmapFontFace, Position, Prop, Size } from "../types";
import { Node } from "./Node";

type BitmapTextProps = {
  font: BitmapFontFace;
  pos: Prop<Position>;
  color?: Prop<string>;
  text: Prop<string>;
}

export const BitmapText: React.FC<BitmapTextProps> = ({ font, ...props }) => {
  const { image, glyphSize, glyphs } = font;
  const element = useElement<SVGSVGElement>();

  const text = useProperty(props.text);
  const pos = usePosition(props.pos);
  const size = useDynamicProperty(text, (text): Size => [text.length * glyphSize[0], glyphSize[1]]);
  const color = useProperty(props.color || 'white');

  const characters = useSync((): string => text.current);
  const id = useId();

  useRender(() => {
    element.setBaseStyles({ pos, size });
    element.setAttribute('viewbox', `0 0 ${size.current[0]} ${size.current[1]}`);
    element.setStyle('--color', color.current);
  });

  return (
    <Node pos={pos}>
      <svg ref={element.ref} className="absolute">
        {[...characters].map((char, index) => {
          const key = `${index}_${char.charCodeAt(0)}`;
          const mask = `${id}_${key}`;
          const [width, height] = glyphSize;
          const [x, y] = [index * width, 0];
          const offset = glyphs.indexOf(char) * glyphSize[0];

          return (
            <>
              <mask key={key} id={mask}>
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill="black"
                />
                <image
                  x={x - (offset % image.size[0])}
                  y={y - Math.floor(offset / image.size[0]) * glyphSize[1]}
                  width={image.size[0]}
                  height={image.size[1]}
                  href={image.url}
                  style={{ imageRendering: 'pixelated' }}
                />
              </mask>
              <rect
                key={key}
                x={x}
                y={y}
                width={width}
                height={height}
                mask={`url(#${mask})`}
                style={{ fill: 'var(--color)' }}
              />
            </>
          );
        })}
      </svg>
    </Node>
  );
};
