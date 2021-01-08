import { EventEmitter2 } from '@nestjs/event-emitter';
import { GuardEvent } from './events/guard.event';
import { BeforeTransitionEvent } from './events/before-transition.event';
import { AfterTransitionEvent } from './events/after-transition.event';
import { SubjectHasNoPropertyException } from './exceptions/subject-has-no-property.exception';
import { TransitionNotFoundException } from './exceptions/transition-not-found.exception';
import { TransitionCantBeAppliedException } from './exceptions/transition-cant-be-applied.exception';
import { TransitionBlockedByGuardException } from './exceptions/transition-blocked-by-guard.exception';
import { GraphInterface } from './interfaces/graph.interface';
import { STATE_MACHINE_STORE } from './tokens';

export class StateMachine<T extends Object> {
  constructor(
    private readonly subject: T,
    private readonly graph: GraphInterface,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async apply(transitionName: string): Promise<void> {
    const transition = this.graph.transitions.find(
      transition => transition.name === transitionName,
    );
    if (!transition) {
      throw new TransitionNotFoundException(
        this.subject,
        this.graph,
        transitionName,
      );
    }

    // Find property name for given graph
    const propName = Object.getOwnPropertyNames(this.subject).find(prop => {
      return (
        Reflect.getMetadata(STATE_MACHINE_STORE, this.subject, prop) ===
        this.graph.name
      );
    });
    if (!propName) {
      throw new SubjectHasNoPropertyException(this.subject, this.graph);
    }

    // Get value of object property found
    const fromState = Object.getOwnPropertyDescriptor(this.subject, propName)
      ?.value;
    if (!transition.from.includes(fromState)) {
      throw new TransitionCantBeAppliedException(
        this.subject,
        this.graph,
        fromState,
        transition,
      );
    }

    // Check guards (sync)
    const guardEvent = new GuardEvent<T>(
      this.subject,
      this.graph,
      fromState,
      transition,
    );
    this.eventEmitter.emit(guardEvent.getName(), guardEvent);

    // Check if any guaurd is blocking
    if (guardEvent.isBlocked()) {
      throw new TransitionBlockedByGuardException(
        this.subject,
        this.graph,
        fromState,
        transition,
        guardEvent.getBlockingReasons(),
      );
    }

    // Emit Before event (async)
    const beforeTransitionEvent = new BeforeTransitionEvent<T>(
      this.subject,
      this.graph,
      fromState,
      transition,
    );
    await this.eventEmitter.emitAsync(
      beforeTransitionEvent.getName(),
      beforeTransitionEvent,
    );

    // Set new state
    Object.defineProperty(this.subject, propName, { value: transition.to });

    // Emit After event (async)
    const afterTransitionEvent = new AfterTransitionEvent<T>(
      this.subject,
      this.graph,
      fromState,
      transition,
    );
    this.eventEmitter.emitAsync(
      afterTransitionEvent.getName(),
      afterTransitionEvent,
    );
  }
}
