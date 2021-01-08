import { Inject, Injectable } from '@nestjs/common';
import { StateMachine } from './state-machine';
import { STATE_MACHINE_GRAPHS } from './tokens';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GraphInterface } from './interfaces/graph.interface';

@Injectable()
export class StateMachineFactory {
  constructor(
    @Inject(STATE_MACHINE_GRAPHS) private graphs: GraphInterface[],
    private readonly eventEmitter: EventEmitter2,
  ) {}

  create<T>(context: T, graphName: string): StateMachine<T> {
    const graph = this.graphs.find(graph => graph.name === graphName);

    if (!graph) {
      throw new Error("Can't find graph with given name: " + graphName);
    }

    return new StateMachine<T>(context, graph, this.eventEmitter);
  }
}
