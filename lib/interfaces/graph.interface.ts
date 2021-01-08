import { TransitionInterface } from './transition.interface';

export interface GraphInterface {
  name: string;
  stateProp: string;
  states: Array<string>;
  transitions: TransitionInterface[];
}
