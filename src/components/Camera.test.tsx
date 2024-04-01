import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { nextFrame, render } from "../test";
import { Position, Prop } from "../types";
import { Camera } from "./Camera";
import { Node } from "./Node";
import { Viewport } from "./Viewport";

describe('Camera', () => {
  const renderSubject = (props?: { pos?: Prop<Position> } & Partial<React.ComponentProps<typeof Camera>>) => {
    const { pos, ...rest } = props || {};

    render(
      <Viewport>
        <Node pos={pos || [0, 0]}>
          <Camera {...rest} />
        </Node>
      </Viewport>
    );
  };

  const getViewport = () => screen.getByTestId<HTMLDivElement>('viewport');

  it('defaults to a position of [0, 0], with a scale factor of 1', () => {
    renderSubject();
    nextFrame();
    expect(getViewport()).toHaveStyle({
      transform: 'translate(0px, 0px) scale(1)',
    });
  });

  it('scrolls the viewport on both axes, by default', () => {
    renderSubject({ pos: [100, 50], axis: 'xy' });
    nextFrame();
    expect(getViewport()).toHaveStyle({
      transform: 'translate(-100px, -50px) scale(1)',
    });
  });

  describe('when scroll axis is "xy"', () => {
    it('scrolls the viewport on both axes', () => {
      renderSubject({ pos: [100, 50], axis: 'xy' });
      nextFrame();
      expect(getViewport()).toHaveStyle({
        transform: 'translate(-100px, -50px) scale(1)',
      });
    });
  });

  describe('when scroll axis is "x"', () => {
    it('only scrolls the viewport on the x axis', () => {
      renderSubject({ pos: [100, 50], axis: 'x' });
      nextFrame();
      expect(getViewport()).toHaveStyle({
        transform: 'translate(-100px, 0px) scale(1)',
      });
    });
  });

  describe('when scroll axis is "y"', () => {
    it('only scrolls the viewport on the y axis', () => {
      renderSubject({ pos: [100, 50], axis: 'y' });
      nextFrame();
      expect(getViewport()).toHaveStyle({
        transform: 'translate(0px, -50px) scale(1)',
      });
    });
  });

  describe('smooth scrolling', () => {
    it('pans the camera position smoothly', () => {
      renderSubject({ pos: [100, 50], axis: 'xy', smooth: true });
      nextFrame();
      expect(getViewport()).toHaveStyle({ transform: 'translate(-7px, -4px) scale(1)' });
      nextFrame();
      expect(getViewport()).toHaveStyle({ transform: 'translate(-14px, -7px) scale(1)' });
      nextFrame();
      expect(getViewport()).toHaveStyle({ transform: 'translate(-20px, -10px) scale(1)' });
      nextFrame();
      expect(getViewport()).toHaveStyle({ transform: 'translate(-26px, -13px) scale(1)' });
      nextFrame();
      expect(getViewport()).toHaveStyle({ transform: 'translate(-31px, -16px) scale(1)' });
      nextFrame();
      expect(getViewport()).toHaveStyle({ transform: 'translate(-36px, -18px) scale(1)' });
      nextFrame();
      expect(getViewport()).toHaveStyle({ transform: 'translate(-41px, -20px) scale(1)' });
      nextFrame();
      expect(getViewport()).toHaveStyle({ transform: 'translate(-45px, -22px) scale(1)' });
      nextFrame();
      expect(getViewport()).toHaveStyle({ transform: 'translate(-49px, -24px) scale(1)' });
      nextFrame();
      expect(getViewport()).toHaveStyle({ transform: 'translate(-53px, -26px) scale(1)' });
    });
  });
});
