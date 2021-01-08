import { GenericStateMachineEvent } from './generic-state-machine.event';

export class GuardEvent<T> extends GenericStateMachineEvent<T> {
  protected readonly eventType: string = 'guard';

  private blocked: boolean = false;

  private blockingReasons: Array<string> = [];

  setBlocked(reason?: string) {
    this.blocked = true;
    if (reason) {
      this.blockingReasons.push(reason);
    }
  }

  isBlocked(): boolean {
    return this.blocked;
  }

  getBlockingReasons(): Array<string> {
    return this.blockingReasons;
  }
}
