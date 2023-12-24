import { MutableRefObject } from "react";
import { Body } from "detect-collisions";
import { Engine } from "matter-js";

export type Property<T> = MutableRefObject<T>;

export type Prop<T> = T | Property<T>;

export type Position = [number, number];

export type Velocity = [number, number];

export type Size = [number, number];

export type BitmapAsset = {
  url: string;
  size: Position;
};

export type BitmapSpriteAsset = BitmapAsset & {
  count: number;
  rate: number;
}

export type Tileset = {
  image: BitmapAsset;
  gridSize: Size;
  cellSize: Size;
}

export type TickerFunction = (delta: number, time: number) => void;

export type UpdateFunction = (delta: number, time: number) => void;

export type RenderFunction = () => void;

export type CollisionUpdateFunction = (body: Body) => void;

export type CollisionEventFunctionProps = {
  collision: SAT.Response;
  tags: string[];
  firstTime: boolean;
};

export type CollisionEventFunction = (props: CollisionEventFunctionProps) => void;

export type CollisionTag = 'solid' | 'platform' | string;

export type PhysicsUpdateFunction = (body: Matter.Body) => void;

export type PhysicsEventType = 'collision';

export type PhysicsEvent = Matter.IEventCollision<Engine>;

export type CameraAxis = 'x' | 'y' | 'xy';
