import { GenericStateMachineEvent } from './generic-state-machine.event';

export class BeginTransitionEvent<T> extends GenericStateMachineEvent<T> {
  protected readonly eventType: string = 'transition';
}
