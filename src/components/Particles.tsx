import { forwardRef, useCallback, useEffect, useRef } from "react";
import { mergeRefs } from "react-merge-refs";
import { useParticles } from "../hooks";

export const Particles = forwardRef<HTMLDivElement>((_, ref) => {
  const particles = useParticles();
  const localRef = useRef<HTMLDivElement>(null);

  const attach = useCallback((element: HTMLElement) => {
    if (localRef.current && element) {
      localRef.current.insertBefore(element, localRef.current.firstChild);
    }
  }, []);

  useEffect(() => {
    particles.addEventListener('create', attach);
    return () => particles.removeEventListener('create', attach);
  }, [attach, particles]);

  return <div ref={mergeRefs([localRef, ref])} />;
});
