import { useRef } from "react";
import { useFixedUpdate, useProperty, useUpdate } from "../hooks";
import { Prop } from "../types";
import { Particle } from "../utils";

export type ParticleGeneratorProps = {
  active?: Prop<boolean>;
  rate: number;
  lifespan: number;
  onInit: (particle: Particle) => void;
  onUpdate: (particle: Particle, delta: number) => void;
}

export const ParticleGenerator: React.FC<ParticleGeneratorProps> = ({ onInit, onUpdate, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);
  const active = useRef<Set<Particle>>(new Set());
  const inactive = useRef<Set<Particle>>(new Set());

  const isActive = useProperty(props.active || false);
  const rate = useProperty(props.rate);
  const lifespan = useProperty(props.lifespan);

  useFixedUpdate(rate, () => {
    if (ref.current && isActive.current) {
      if (inactive.current.size > 0) {
        // Reuse an inactive particle.
        const particle = [...inactive.current][0];
        inactive.current.delete(particle);
        active.current.add(particle);
        particle.node.style.display = 'block';
        onInit(particle);

      } else {
        // Create a new particle.
        const node = ref.current.insertBefore(document.createElement('div'), ref.current.firstChild);
        const particle = new Particle(node);
        active.current.add(particle);
        particle.node.style.display = 'block';
        onInit(particle);
      }
    }
  });

  useUpdate((delta) => {
    if (ref.current) {
      for (const particle of active.current) {
        onUpdate(particle, delta);

        if (particle.age.current >= lifespan.current) {
          active.current.delete(particle);
          inactive.current.add(particle);
          particle.node.style.display = 'none';
        }
      }
    }
  });

  return <div ref={ref} />;
};
