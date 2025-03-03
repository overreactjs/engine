import { useCallback, useEffect, useRef } from "react";
import { useParticles } from "../hooks";

export const Particles: React.FC = () => {
  const particles = useParticles();
  const ref = useRef<HTMLDivElement>(null);

  const attach = useCallback((element: HTMLElement) => {
    if (ref.current && element) {
      ref.current.insertBefore(element, ref.current.firstChild);
    }
  }, []);

  useEffect(() => {
    particles.addEventListener('create', attach);
    return () => particles.removeEventListener('create', attach);
  }, [attach, particles]);

  return <div ref={ref} />;
};
