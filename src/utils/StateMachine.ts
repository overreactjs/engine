import { Property, StateDefinitions } from "../types";
import { VariableProperty } from "./VariableProperty";

export class StateMachine<T> {

  readonly entity: T;

  readonly states: StateDefinitions<T>;

  readonly stack: Property<string[]>;

  readonly state: Property<string>;

  readonly age: Property<number>;
  
  init = false;

  constructor(entity: T, state: string, states: StateDefinitions<T>) {
    this.entity = entity;
    this.age = new VariableProperty(0);
    this.stack = new VariableProperty([state]);
    this.state = new VariableProperty(state);
    this.states = states;
  }

  update(delta: number) {
    if (!this.init) {
      this.age.current += delta;
    }
    
    this.init = false;
  
    const stack = this.stack.current;
    (this.states[stack[stack.length - 1]])?.(this, delta);
  }

  push(state: string) {
    this.stack.current.push(state);
    this.state.current = state;
    this.age.current = 0;
    this.init = true;
  }

  pop() {
    this.stack.current.pop();
    this.state.current = this.stack.current[this.stack.current.length - 1];
    this.age.current = 0;
    this.init = true;
  }

  replace(state: string) {
    const index = this.stack.current.length - 1;
    
    if (this.stack.current[index] !== state) {
      this.stack.current[index] = state;
      this.state.current = state;
      this.age.current = 0;
      this.init = true;
    }
  }
}
