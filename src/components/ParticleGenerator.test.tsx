import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { advanceFrames, nextFrame, render } from "../test";
import { ParticleGenerator } from ".";

describe('ParticleGenerator', () => {
  const renderSubject = (props?: Partial<React.ComponentProps<typeof ParticleGenerator>>) => {
    return render(
      <ParticleGenerator
        active={true}
        rate={20}
        lifespan={60}
        onInit={vi.fn()}
        onUpdate={vi.fn()}
        data-testid="particles"
        {...props}
      />
    );
  };

  const getParticles = () => [...screen.getByTestId('particles').children] as HTMLElement[];
  const getActiveParticles = () => getParticles().filter(({ style }) => style.display === 'block');

  it('reuses inactive particles, instead of always creating new elements', () => {
    renderSubject();

    expect(getParticles().length).toBe(0);
    expect(getActiveParticles().length).toBe(0);

    advanceFrames(4); // 60ms - first particle created at 50ms
    expect(getParticles().length).toBe(1);
    expect(getActiveParticles().length).toBe(1);

    advanceFrames(2); // 90ms
    expect(getParticles().length).toBe(1);
    expect(getActiveParticles().length).toBe(1);

    nextFrame(); // 105ms - second particle created at 100ms
    expect(getParticles().length).toBe(2);
    expect(getActiveParticles().length).toBe(2);

    nextFrame(); // 120ms - first particle dies at 110ms
    expect(getParticles().length).toBe(2);
    expect(getActiveParticles().length).toBe(1);

    advanceFrames(2); // 150ms - third particle created, reusing first particle
    expect(getParticles().length).toBe(2);
    expect(getActiveParticles().length).toBe(2);

    nextFrame(); // 165ms - second particle dies at 160ms
    expect(getParticles().length).toBe(2);
    expect(getActiveParticles().length).toBe(1);
  });

  describe('when the generator is not active', () => {
    it('generates nothing', () => {
      renderSubject({ active: false });

    expect(getParticles().length).toBe(0);
    expect(getActiveParticles().length).toBe(0);

    advanceFrames(4);
    expect(getParticles().length).toBe(0);
    expect(getActiveParticles().length).toBe(0);
    })
  });
});