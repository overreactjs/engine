import { Property, StateDefinitions } from "../types";
import { DynamicProperty } from "./DynamicProperty";
import { VariableProperty } from "./VariableProperty";

export class StateMachine<T> {

  readonly entity: T;

  readonly states: StateDefinitions<T>;

  readonly stack: Property<string[]>;

  readonly state: Property<string>;

  age: number = 0;
  
  init = false;

  constructor(entity: T, state: string, states: StateDefinitions<T>) {
    this.entity = entity;
    this.stack = new VariableProperty([state]);
    this.state = new DynamicProperty(this.stack, (stack) => stack[stack.length - 1]);
    this.states = states;
  }

  update(delta: number) {
    if (!this.init) {
      this.age += delta;
    }
    
    this.init = false;
  
    const stack = this.stack.current;
    (this.states[stack[stack.length - 1]])?.(this, delta);
  }

  push(state: string) {
    this.stack.current.push(state);
    this.age = 0;
    this.init = true;
  }

  pop() {
    this.stack.current.pop();
    this.age = 0;
    this.init = true;
  }

  replace(state: string) {
    const index = this.stack.current.length - 1;
    
    if (this.stack.current[index] !== state) {
      this.stack.current[index] = state;
      this.age = 0;
      this.init = true;
    }
  }
}
