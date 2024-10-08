import React, { useMemo } from "react";
import { Property, Position, Prop } from "../types";
import { useElement, useProperty, useRender } from "../hooks";

type ViewportContextProps = {
  origin?: Property<Position>;
}

export const ViewportContext = React.createContext<ViewportContextProps>({
  origin: undefined,
});

/**
 * Viewport
 * --------
 * 
 * Hide everything outside of the viewport, centering the content. The focus position can be
 * controlled by a nested camera.
 */

type ViewportProps = {
  children: React.ReactNode;
  scale?: Prop<number>;
}

export const Viewport: React.FC<ViewportProps> = ({ children, ...props }) => {
  const element = useElement<HTMLDivElement>();

  const scale = useProperty(props.scale || 1);
  const origin = useProperty<Position>([0, 0]);
  const context = useMemo(() => ({ origin }), [origin]);

  useRender(() => {
    if (origin.invalidated || scale.invalidated) {
      const x = -Math.round(origin.current[0] * scale.current);
      const y = -Math.round(origin.current[1] * scale.current);
      element.setStyle('transform', `translate(${x}px, ${y}px) scale(${scale.current})`);
      origin.invalidated = false;
      scale.invalidated = false;
    }
  });

  return (
    <div className="overflow-hidden w-full h-full absolute">
      <div ref={element.ref} className="relative left-[50%] top-[50%] bg-yellow-500 h-0 w-0" data-testid="viewport">
        <ViewportContext.Provider value={context}>
          {children}
        </ViewportContext.Provider>
      </div>
    </div>
  );
}
