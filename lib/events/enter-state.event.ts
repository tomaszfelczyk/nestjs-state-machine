import { GenericStateMachineEvent } from './generic-state-machine.event';

export class EnterStateEvent<T> extends GenericStateMachineEvent<T> {
  protected readonly eventType: string = 'enter';

  getName(): string {
    return `${this.baseEventName}.${this.graph.name}.${this.eventType}.${this.fromState}`;
  }
}
