import { Box, Polygon, PotentialVector } from "detect-collisions";

export type Body<T = unknown> = BoxBody<T> | PolygonBody<T>;

export class BoxBody<T = unknown> extends Box {
  readonly entity?: T;

  constructor(position: PotentialVector, width: number, height: number, entity?: T) {
    super(position, width, height, undefined);
    this.entity = entity;
  }
}

export class PolygonBody<T = unknown> extends Polygon {
  readonly entity?: T;

  constructor(position: PotentialVector, points: PotentialVector[], entity?: T) {
    super(position, points);
    this.entity = entity;
  }
}
