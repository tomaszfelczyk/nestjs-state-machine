import { TransitionInterface } from './transition.interface';

export interface GraphInterface {
  name: string;
  initialState: string;
  states: Array<string>;
  transitions: TransitionInterface[];
}
