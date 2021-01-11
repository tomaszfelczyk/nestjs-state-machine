import { GenericStateMachineEvent } from './generic-state-machine.event';

export class LeaveStateEvent<T> extends GenericStateMachineEvent<T> {
  protected readonly eventType: string = 'leave';

  getName(): string {
    return `${this.baseEventName}.${this.graph.name}.${this.eventType}.${this.fromState}`;
  }
}
