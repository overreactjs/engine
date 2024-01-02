import { Property, Position, Velocity } from "../types";
import { VariableProperty } from "./VariableProperty";

export class Particle {
  node: HTMLDivElement;
  age: Property<number> = new VariableProperty(0);
  pos: Property<Position> = new VariableProperty([0, 0]);
  velocity: Property<Velocity> = new VariableProperty([0, 0]);
  opacity: Property<number> = new VariableProperty(100);
  scale: Property<number> = new VariableProperty(1);

  constructor(node: HTMLDivElement) {
    this.node = node;
  }
}
