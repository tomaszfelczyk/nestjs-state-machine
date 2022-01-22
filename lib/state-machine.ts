import { EventEmitter2 } from '@nestjs/event-emitter';
import { GuardEvent } from './events/guard.event';
import { EnterStateEvent, EnteredStateEvent } from './events';
import { TransitionNotFoundException } from './exceptions/transition-not-found.exception';
import { TransitionCantBeAppliedException } from './exceptions/transition-cant-be-applied.exception';
import { TransitionBlockedByGuardException } from './exceptions/transition-blocked-by-guard.exception';
import { GraphInterface } from './interfaces/graph.interface';
import { TransitionInterface } from './interfaces/transition.interface';
import { LeaveStateEvent } from './events/leave-state.event';
import { BeginTransitionEvent } from './events/begin-transition.event';
import { CompletedTransitionEvent } from './events/completed-transition.event';
import { AnnounceTransitionsEvent } from './events/announce-transitions.event';

export class StateMachine<T> {
  constructor(
    private readonly subject: T,
    private readonly graph: GraphInterface,
    private readonly statePropName: string,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async can(transitionName: string): Promise<boolean> {
    const transition = this.getTransition(transitionName);
    const fromState = this.getSubjectCurrentState();

    if (!transition.from.includes(fromState)) {
      return false;
    }

    const guardEvent = await this.checkGuards(fromState, transition);
    return !guardEvent.isBlocked();
  }

  getAvailableTransitions(): TransitionInterface[] {
    const state = this.getSubjectCurrentState();
    return this.graph.transitions.filter(transition =>
      transition.from.includes(state),
    );
  }

  async apply(transitionName: string): Promise<void> {
    const transition = this.getTransition(transitionName);

    const fromState = this.getSubjectCurrentState();
    if (!transition.from.includes(fromState)) {
      throw new TransitionCantBeAppliedException(
        this.subject,
        this.graph,
        fromState,
        transition,
      );
    }

    // Check Guards
    const guardEvent = await this.checkGuards(fromState, transition);
    if (guardEvent.isBlocked()) {
      throw new TransitionBlockedByGuardException(
        this.subject,
        this.graph,
        fromState,
        transition,
        guardEvent.getBlockingReasons(),
      );
    }

    // LeaveStateEvent
    await this.leaveState(fromState, transition);

    // BeginTransactionEvent
    await this.beginTransition(fromState, transition);

    // EnterStateEvent
    await this.enterState(fromState, transition);

    // Set new state
    Object.defineProperty(this.subject, this.statePropName, {
      value: transition.to,
    });

    // EnteredStateEvent
    await this.enteredState(fromState, transition);

    // CompletedTransactionEvent
    await this.completedTransition(fromState, transition);

    // AnnounceTransactionsEvent
    this.getAvailableTransitions().forEach(async availableTransition => {
      await this.announceTransactions(fromState, availableTransition);
    });
  }

  private getTransition(transitionName: string): TransitionInterface {
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
    return transition;
  }

  private getSubjectCurrentState(): string {
    // Get value of object property
    return Object.getOwnPropertyDescriptor(this.subject, this.statePropName)
      ?.value;
  }

  private async checkGuards(
    fromState: string,
    transition: TransitionInterface,
  ): Promise<GuardEvent<T>> {
    const guardEvent = new GuardEvent<T>(
      this.subject,
      this.graph,
      fromState,
      transition,
    );
    await this.eventEmitter.emitAsync(guardEvent.getName(), guardEvent);
    return guardEvent;
  }

  private async leaveState(
    fromState: string,
    transition: TransitionInterface,
  ): Promise<void> {
    const leaveStateEvent = new LeaveStateEvent<T>(
      this.subject,
      this.graph,
      fromState,
      transition,
    );
    await this.eventEmitter.emitAsync(
      leaveStateEvent.getName(),
      leaveStateEvent,
    );
  }

  private async beginTransition(
    fromState: string,
    transition: TransitionInterface,
  ): Promise<void> {
    const beginTransitionEvent = new BeginTransitionEvent<T>(
      this.subject,
      this.graph,
      fromState,
      transition,
    );
    await this.eventEmitter.emitAsync(
      beginTransitionEvent.getName(),
      beginTransitionEvent,
    );
  }

  private async enterState(
    fromState: string,
    transition: TransitionInterface,
  ): Promise<void> {
    const enterStateEvent = new EnterStateEvent<T>(
      this.subject,
      this.graph,
      fromState,
      transition,
    );
    await this.eventEmitter.emitAsync(
      enterStateEvent.getName(),
      enterStateEvent,
    );
  }

  private async enteredState(
    fromState: string,
    transition: TransitionInterface,
  ): Promise<void> {
    const eneteredStateEvent = new EnteredStateEvent<T>(
      this.subject,
      this.graph,
      fromState,
      transition,
    );
    await this.eventEmitter.emitAsync(
      eneteredStateEvent.getName(),
      eneteredStateEvent,
    );
  }

  private async completedTransition(
    fromState: string,
    transition: TransitionInterface,
  ): Promise<void> {
    const completeTransitionEvent = new CompletedTransitionEvent<T>(
      this.subject,
      this.graph,
      fromState,
      transition,
    );
    await this.eventEmitter.emitAsync(
      completeTransitionEvent.getName(),
      completeTransitionEvent,
    );
  }

  private async announceTransactions(
    fromState: string,
    transition: TransitionInterface,
  ): Promise<void> {
    const announceTransactionsEvent = new AnnounceTransitionsEvent<T>(
      this.subject,
      this.graph,
      fromState,
      transition,
    );
    await this.eventEmitter.emitAsync(
      announceTransactionsEvent.getName(),
      announceTransactionsEvent,
    );
  }
}
