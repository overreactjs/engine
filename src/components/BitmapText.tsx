import { useDynamicProperty, usePosition, useProperty, useSync } from "../hooks";
import { BitmapFontFace, Position, Prop, Property, Size } from "../types";
import { Box } from "./Box";
import { BitmapImage } from "./BitmapImage";

type BitmapTextProps = {
  font: BitmapFontFace;
  pos?: Prop<Position>;
  text: Prop<string>;
}

export const BitmapText: React.FC<BitmapTextProps> = ({ font, ...props }) => {
  const { glyphSize } = font;

  const text = useProperty(props.text);
  const pos = usePosition(props.pos);
  const size = useDynamicProperty(text, (text): Size => [text.length * glyphSize[0], glyphSize[1]]);
  const length = useSync(() => text.current.length);

  const characters = [];
  for (let index = 0; index < length; index++) {
    characters.push(<BitmapCharacter key={index} text={text} index={index} font={font} />);
  }

  return (
    <Box pos={pos} size={size}>
      {characters}
    </Box>
  );
};

type BitmapCharacterProps = {
  text: Property<string>;
  index: number;
  font: BitmapFontFace;
}

const BitmapCharacter: React.FC<BitmapCharacterProps> = ({ text, index, font }) => {
  const { image, glyphSize, glyphs } = font;
  const [width, height] = glyphSize;
  const [x, y] = [index * width, 0];

  const offset = useDynamicProperty(text, (text): Position => {
    const offset = glyphs.indexOf(text[index]) * width;
    const ox = offset % image.size[0];
    const oy = Math.floor(offset / image.size[0]) * height;
    return [ox, oy];
  });

  return <BitmapImage pos={[x, y]} offset={offset} image={image} size={glyphSize} />;
};

// export const BitmapText: React.FC<BitmapTextProps> = ({ font, ...props }) => {
//   const { glyphSize } = font;
//   const element = useElement<SVGSVGElement>();

//   const text = useProperty(props.text);
//   const pos = usePosition(props.pos);
//   const size = useDynamicProperty(text, (text): Size => [text.length * glyphSize[0], glyphSize[1]]);
//   const color = useProperty(props.color || 'white');
//   const length = useSync(() => text.current.length);

//   useRender(() => {
//     element.setBaseStyles({ pos, size });
//     element.setAttribute('viewbox', `0 0 ${size.current[0]} ${size.current[1]}`);
//     element.setStyle('--color', color.current);
//   });

//   const characters = [];
//   for (let index = 0; index < length; index++) {
//     characters.push(<BitmapCharacter key={index} text={text} index={index} font={font} />);
//   }

//   return (
//     <Node pos={pos}>
//       <svg ref={element.ref} className="absolute">
//         {characters}
//       </svg>
//     </Node>
//   );
// };

// type BitmapCharacterProps = {
//   text: Property<string>;
//   index: number;
//   font: BitmapFontFace;
// }

// const BitmapCharacter: React.FC<BitmapCharacterProps> = ({ text, index, font }) => {
//   const { image, glyphSize, glyphs } = font;
//   const [width, height] = glyphSize;
//   const [x, y] = [index * width, 0];

//   const element1 = useElement<SVGImageElement>();
//   const element2 = useElement<SVGImageElement>();
//   const mask1 = useId();
//   const mask2 = useId();

//   const rectProps = { x, y, width, height };
//   const imageProps = {
//     width: image.size[0],
//     height: image.size[1],
//     href: image.url,
//     style: { imageRendering: 'pixelated' } as CSSProperties,
//   };

//   useRender(() => {
//     if (text.invalidated) {
//       console.log('BitmapCharacter/render...', index, text.current);

//       const offset = glyphs.indexOf(text.current[index]) * glyphSize[0];
//       const dx = x - (offset % image.size[0]);
//       const dy = y - Math.floor(offset / image.size[0]) * glyphSize[1];

//       element1.setAttribute('x', dx);
//       element1.setAttribute('y', dy);

//       element2.setAttribute('x', dx);
//       element2.setAttribute('y', dy);

//       text.invalidated = false;
//     }
//   });

//   return (
//     <g>
//       <mask id={mask1}>
//         <rect {...rectProps} fill="white" />
//       </mask>
//       <mask id={mask2}>
//         <rect {...rectProps} fill="black" />
//         <image {...imageProps} ref={element2.ref} />
//       </mask>

//       <image {...imageProps} mask={`url(#${mask1})`} ref={element1.ref} />
//       <rect {...rectProps} mask={`url(#${mask2})`} style={{ fill: 'var(--color)' }} />
//     </g>
//   );
// };
