import { GenericStateMachineEvent } from './generic-state-machine.event';

export class EnteredStateEvent<T> extends GenericStateMachineEvent<T> {
  protected readonly eventType: string = 'entered';

  getName(): string {
    return `${this.baseEventName}.${this.graph.name}.${this.eventType}.${this.fromState}`;
  }
}
