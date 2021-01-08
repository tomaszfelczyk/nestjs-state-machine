import { GenericStateMachineEvent } from './generic-state-machine.event';

export class BeforeTransitionEvent<T> extends GenericStateMachineEvent<T> {
  protected readonly eventType: string = 'before';
}
