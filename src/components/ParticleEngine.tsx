import { createContext, useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { BaseParticle } from "../utils";
import { useEventListeners, useUpdate } from "../hooks";

export type ParticleContextProps = {
  attach: (particle: BaseParticle) => void;
  addEventListener: (type: "create", fn: (element: HTMLElement) => void) => void
  removeEventListener: (type: "create", fn: (element: HTMLElement) => void) => void
};

export const ParticleContext = createContext<ParticleContextProps>({
  attach: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
});

export type ParticleEngineProps = {
  children: React.ReactNode;
  pool?: number
};

export const ParticleEngine: React.FC<ParticleEngineProps> = ({ children, pool }) => {
  const active = useRef<Set<BaseParticle>>(new Set());
  const inactive = useRef<Set<HTMLDivElement>>(new Set());

  const { addEventListener, removeEventListener, fireEvent } = useEventListeners<'create', HTMLElement>();

  const attach = useCallback((particle: BaseParticle) => {
    if (inactive.current.size > 0) {
      const node = [...inactive.current][0];
      inactive.current.delete(node);
      active.current.add(particle);
      particle.attach(node);
      particle.init();
    } else {
      const node = document.createElement('div');
      active.current.add(particle);
      particle.attach(node);
      particle.init();
      fireEvent('create', node);
    }
  }, [fireEvent]);

  useUpdate((delta) => {
    for (const particle of active.current) {
      if (particle.node) {
        if (particle.spawned) {
          particle.spawned = false;
        } else {
          particle.ttl -= delta;
          particle.update(delta);

          if (particle.ttl <= 0) {
            active.current.delete(particle);
            inactive.current.add(particle.node);
            particle.destroy();
          }
        }
      }
    }
  });

  useLayoutEffect(() => {
    if (pool) {
      while (inactive.current.size < pool) {
        const node = document.createElement('div');
        inactive.current.add(node);
        fireEvent('create', node);
      }
    }
  }, [fireEvent, pool]);

  const context = useMemo(() => ({ attach, addEventListener, removeEventListener }), [attach, addEventListener, removeEventListener]);
  
  return (
    <ParticleContext.Provider value={context}>
      {children}
    </ParticleContext.Provider>
  );
};
