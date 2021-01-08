import { GraphInterface } from '../interfaces/graph.interface';
import { TransitionInterface } from '../interfaces/transition.interface';

export abstract class GenericStateMachineEvent<T> {
  private readonly baseEventName: string = 'state-machine';

  protected readonly eventType: string = '*';

  constructor(
    readonly subject: T,
    readonly graph: GraphInterface,
    readonly fromState: string,
    readonly transition: TransitionInterface,
  ) {}

  getName(): string {
    return `${this.baseEventName}.${this.graph.name}.${this.eventType}.${this.transition.name}`;
  }
}
