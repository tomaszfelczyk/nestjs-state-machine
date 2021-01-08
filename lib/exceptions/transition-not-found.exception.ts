import { GraphInterface } from '../interfaces/graph.interface';
import { StateMachineException } from './state-machine.exception';

export class TransitionNotFoundException<T> extends StateMachineException<T> {
  constructor(
    readonly subject: T,
    readonly graph: GraphInterface,
    readonly missingTransitionName: string,
  ) {
    super(
      subject,
      graph,
      undefined,
      undefined,
      'Transition not found: ' + missingTransitionName,
    );
  }
}
