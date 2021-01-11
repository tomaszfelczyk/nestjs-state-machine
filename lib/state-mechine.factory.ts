import { Inject, Injectable } from '@nestjs/common';
import { StateMachine } from './state-machine';
import { STATE_MACHINE_GRAPHS, STATE_MACHINE_STORE } from './tokens';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GraphInterface } from './interfaces/graph.interface';
import { SubjectHasNoPropertyException } from './exceptions/subject-has-no-property.exception';

@Injectable()
export class StateMachineFactory {
  constructor(
    @Inject(STATE_MACHINE_GRAPHS) private graphs: GraphInterface[],
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
  ) {}

  create<T>(subject: T, graphName: string): StateMachine<T> {
    const graph = this.graphs.find(graph => graph.name === graphName);

    if (!graph) {
      throw new Error("Can't find graph with given name: " + graphName);
    }

    const statePropName = this.findPropertyNameOfSubjectWithGraphState(
      subject,
      graph,
    );
    if (!statePropName) {
      throw new SubjectHasNoPropertyException(subject, graph);
    }

    return new StateMachine<T>(
      subject,
      graph,
      statePropName,
      this.eventEmitter,
    );
  }

  private findPropertyNameOfSubjectWithGraphState<T>(
    subject: T,
    graph: GraphInterface,
  ): string | undefined {
    // Find property name for given graph
    return Object.getOwnPropertyNames(subject).find(prop => {
      return (
        Reflect.getMetadata(STATE_MACHINE_STORE, subject, prop) === graph.name
      );
    });
  }
}
