import { useRef } from "react";
import { useFixedUpdate, useProperty, useUpdate } from "../hooks";
import { Particle } from "../utils";

export type ParticleGeneratorProps = {
  rate: number;
  lifespan: number;
  onInit: (particle: Particle) => void;
  onUpdate: (particle: Particle, delta: number) => void;
  initImmediately?: boolean;
  shouldUpdate: () => boolean;
}

export const ParticleGenerator: React.FC<ParticleGeneratorProps> = ({ onInit, onUpdate, initImmediately, shouldUpdate, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);
  const active = useRef<Set<Particle>>(new Set());
  const inactive = useRef<Set<Particle>>(new Set());

  const rate = useProperty(props.rate);
  const lifespan = useProperty(props.lifespan);

  useFixedUpdate(rate, () => {
    const currentRef = ref.current

    if (currentRef) {
      const createNewParticle = () => {
        // Create a new particle.
        const node = currentRef.insertBefore(document.createElement('div'), currentRef.firstChild);
        const particle = new Particle(node);
        active.current.add(particle);
        onInit(particle);
      }
        
      if (inactive.current.size > 0) {
        // Reuse an inactive particle.
        const particle = [...inactive.current][0];
        inactive.current.delete(particle);
        active.current.add(particle);
        onInit(particle);
      } else {
        createNewParticle();
      }
    }
  }, initImmediately, shouldUpdate);

  useUpdate((delta) => {
    if (ref.current) {
      for (const particle of active.current) {
        onUpdate(particle, delta);

        if (particle.age.current >= lifespan.current) {
          active.current.delete(particle);
          inactive.current.add(particle);
        }
      }
    }
  });

  return <div ref={ref} />;
};
