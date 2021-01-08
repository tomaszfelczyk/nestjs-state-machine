import { DynamicModule, Provider } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphInterface } from './interfaces/graph.interface';
import { StateMachineFactory } from './state-mechine.factory';
import { STATE_MACHINE_GRAPHS } from './tokens';

export class StateMachineModule {
  static forRoot(graphs: GraphInterface[]): DynamicModule {
    const graphsProvider: Provider = {
      provide: STATE_MACHINE_GRAPHS,
      useValue: graphs,
    };

    return {
      module: StateMachineModule,
      imports: [EventEmitterModule],
      providers: [graphsProvider, StateMachineFactory],
      exports: [StateMachineFactory],
    };
  }
}
