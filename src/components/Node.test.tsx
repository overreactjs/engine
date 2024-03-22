import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { useUpdate } from '../hooks';
import { nextFrame, render, renderHook } from '../test';
import { Prop } from '../types';
import { VariableProperty } from '../utils';
import { Box } from './Box';
import { Engine } from './Engine';
import { Node } from './Node';

describe('Node', () => {
  it('passes the position on to nested elements', () => {
    render(
      <Node pos={[100, 50]}>
        <Box size={[10, 10]}>test</Box>
      </Node>
    );

    const box = screen.getByText('test');
    expect(box).toHaveStyle({ transform: 'translate(100px, 50px) rotate(0deg)' });
  });

  describe('when a position offset is given', () => {
    it('adds the offset onto the position', () => {
      render(
        <Node pos={[100, 50]} offset={[10, 20]}>
          <Box size={[10, 10]}>test</Box>
        </Node>
      );

      const box = screen.getByText('test');
      expect(box).toHaveStyle({ transform: 'translate(110px, 70px) rotate(0deg)' });
    });
  });

  describe('when the rounded flag is set', () => {
    it('rounds the position to the nearest integer', () => {
      render(
        <Node pos={[100, 50]} offset={[0.5, 2.2]} rounded>
          <Box size={[10, 10]}>test</Box>
        </Node>
      );

      const box = screen.getByText('test');
      expect(box).toHaveStyle({ transform: 'translate(101px, 52px) rotate(0deg)' });
    });
  });

  describe('when a time scale is given', () => {
    const createWrapper = ({ timeScale }: { timeScale?: Prop<number> }) => {
      return ({ children }: { children: React.ReactNode }) => {
        return (
          <Engine>
            <Node timeScale={timeScale}>{children}</Node>
          </Engine>
        );
      };
    };

    it('affects the delta passed to nested useUpdate calls', () => {
      const callback = vi.fn();
      const timeScale = new VariableProperty(1);
      renderHook(() => useUpdate(callback), { wrapper: createWrapper({ timeScale })});

      nextFrame();
      expect(callback).toBeCalledWith(15, expect.any(Number));

      timeScale.current = 0.5;
      nextFrame();
      expect(callback).toBeCalledWith(7.5, expect.any(Number));

      timeScale.current = 2.0;
      nextFrame();
      expect(callback).toBeCalledWith(30, expect.any(Number));

    });
  });
});