import { useRef } from 'react';
import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useParticles } from '../hooks';
import { advanceFrames, nextFrame } from '../test';
import { Engine } from './Engine';
import { ParticleEngine, ParticleEngineProps } from './ParticleEngine';
import { Particles } from './Particles';
import { BaseParticle } from '../utils';

class Particle extends BaseParticle {
  constructor() {
    super();
    this.ttl = 75;
  }
  init(): void {
    this.node.textContent = '0';
  }
  update(): void {
    this.node.textContent = String(parseInt(this.node.textContent || '0', 10) + 1);
  }
  destroy(): void {
    this.node.textContent = '-';
  }
}

describe('ParticleEngine', () => {
  const createSubject = (props?: Omit<ParticleEngineProps, 'children'>) => {
    const container = renderHook(() => useRef<HTMLDivElement>(null)).result.current;

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <Engine>
        <ParticleEngine {...props}>
          <Particles ref={container} />
          {children}
        </ParticleEngine>
      </Engine>
    );

    const particles = renderHook(() => useParticles(), { wrapper: Wrapper }).result.current;
    nextFrame();

    return { container, particles };
  };

  it('initialises an empty particle pool', () => {
    const { container } = createSubject();
    expect(container.current?.children.length).toBe(0);
  });
  
  describe('when a particle is attached', () => {
    it('creates a new particle element and attaches it to the DOM', () => {
      const { container, particles } = createSubject();
      const particle = new Particle();
      expect(container.current?.children.length).toBe(0);

      particles.attach(particle);
      expect(container.current?.children.length).toBe(1);
      expect(particle.node.textContent).toBe('0');
    });

    it('does not update the particle on the frame it spawns', () => {
      const { particles } = createSubject();
      const particle = new Particle();
      particles.attach(particle);

      nextFrame();
      expect(particle.node.textContent).toBe('0');
      expect(particle.ttl).toBe(75);
    })
  });

  describe('when the game engine ticks', () => {
    it('updates the particle', () => {
      const { particles } = createSubject();
      const particle = new Particle();
      particles.attach(particle);
      nextFrame();

      nextFrame();
      expect(particle.node.textContent).toBe('1');

      nextFrame();
      expect(particle.node.textContent).toBe('2');

      nextFrame();
      expect(particle.node.textContent).toBe('3');

      nextFrame();
      expect(particle.node.textContent).toBe('4');
    });
  });

  describe('when the particle reaches the end of its life', () => {
    it('destroys the particle', () => {
      const { particles } = createSubject();
      const particle = new Particle();
      particles.attach(particle);
      nextFrame();

      advanceFrames(5); // 15 * 5 = 75
      expect(particle.ttl).toBe(0);
      expect(particle.node.textContent).toBe('-');
    });
  });

  describe('when a second particle is attached', () => {
    describe('and there are no inactive nodes', () => {
      it('creates a new node', () => {
        const { container, particles } = createSubject();
        particles.attach(new Particle());
        expect(container.current?.children.length).toBe(1);

        particles.attach(new Particle());
        expect(container.current?.children.length).toBe(2);
      });
    });

    describe('and there are is an inactive node', () => {
      it('reuses the existing node', () => {
        const { container, particles } = createSubject();
        particles.attach(new Particle());
        expect(container.current?.children.length).toBe(1);
        
        advanceFrames(6); // enough time for the particle to die.

        particles.attach(new Particle());
        expect(container.current?.children.length).toBe(1);
      });
    });
  });

  describe('when the `pool` prop is specified', () => {
    it('creates a particle pool of the correct size', () => {
      const { container } = createSubject({ pool: 200 });
      expect(container.current?.children.length).toBe(200);
    });

    it('creates empty particle nodes in the pool', () => {
      const { container } = createSubject({ pool: 200 });
      for (const child of container.current?.children || []) {
        expect(child.hasChildNodes()).toBe(false);
        expect(child.textContent).toBe('');
      }
    });
  });
});