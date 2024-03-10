import { Box, PotentialVector } from "detect-collisions";

export type Body<T = unknown> = BoxBody<T>;

export class BoxBody<T = unknown> extends Box {
  readonly entity?: T;

  constructor(position: PotentialVector, width: number, height: number, entity?: T) {
    super(position, width, height, undefined);
    this.entity = entity;
  }
}