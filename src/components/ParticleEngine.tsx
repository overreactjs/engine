import { createContext, useCallback, useMemo, useRef } from "react";
import { BaseParticle } from "../utils";
import { useEventListeners, useUpdate } from "../hooks";

export type ParticleContextProps = {
  attach: (particle: BaseParticle) => void;
  addEventListener: (type: "create", fn: (particle: BaseParticle) => void) => void
  removeEventListener: (type: "create", fn: (particle: BaseParticle) => void) => void
};

export const ParticleContext = createContext<ParticleContextProps>({
  attach: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
});

export type ParticleEngineProps = {
  children: React.ReactNode;
};

export const ParticleEngine: React.FC<ParticleEngineProps> = ({ children }) => {
  const active = useRef<Set<BaseParticle>>(new Set());
  const inactive = useRef<Set<HTMLDivElement>>(new Set());

  const { addEventListener, removeEventListener, fireEvent } = useEventListeners<'create', BaseParticle>();

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
      fireEvent('create', particle);
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

  const context = useMemo(() => ({ attach, addEventListener, removeEventListener }), [attach, addEventListener, removeEventListener]);
  
  return (
    <ParticleContext.Provider value={context}>
      {children}
    </ParticleContext.Provider>
  );
};
