import { GenericStateMachineEvent } from './generic-state-machine.event';

export class AnnounceTransitionsEvent<T> extends GenericStateMachineEvent<T> {
  protected readonly eventType: string = 'announce';
}
