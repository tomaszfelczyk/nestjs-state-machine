import { GenericStateMachineEvent } from './generic-state-machine.event';

export class AfterTransitionEvent<T> extends GenericStateMachineEvent<T> {
  protected readonly eventType: string = 'after';
}
