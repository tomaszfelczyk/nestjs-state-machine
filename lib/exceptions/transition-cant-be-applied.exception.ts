import { GraphInterface } from '../interfaces/graph.interface';
import { TransitionInterface } from '../interfaces/transition.interface';
import { StateMachineException } from './state-machine.exception';

export class TransitionCantBeAppliedException<
  T
> extends StateMachineException<T> {
  constructor(
    readonly subject: T,
    readonly graph: GraphInterface,
    readonly fromState: string,
    readonly transition: TransitionInterface,
  ) {
    super(
      subject,
      graph,
      fromState,
      transition,
      "Transition can't be applied: " + transition.name,
    );
  }
}
