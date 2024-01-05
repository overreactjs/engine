import { Prop, Position, useElement, useRender, usePosition, useDebug } from "..";

type CoordinatesProps = {
  pos: Prop<Position>;
}

/**
 *  Adds coordinates x and y labels to the screen when in debug mode
 */
export const Coordinates: React.FC<CoordinatesProps> = (props) => {
  const posXElement = useElement<HTMLDivElement>();
  const posYElement = useElement<HTMLDivElement>();
  const labelElement = useElement<HTMLDivElement>();
  const pos = usePosition(props.pos);
  const debug = useDebug();

  useRender(() => {
    if (debug) {
      labelElement.setBaseStyles({ pos });
      posXElement.setText(`x: ${Math.round(pos.current[0]).toString()}`);
      posYElement.setText(`y: ${Math.round(pos.current[1]).toString()}`);
    }
  });

  if (!debug) {
    return null;
  }

  return (
    <div ref={labelElement.ref} className="text-white text-2xl font-bold">
      <div className="tabular-nums w-[100px]" ref={posXElement.ref} />
      <div className="tabular-nums w-[100px]" ref={posYElement.ref} />
    </div>
  );
};
