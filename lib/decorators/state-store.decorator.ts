import { STATE_MACHINE_STORE } from '../tokens';

export const StateStore = (graphName: string): PropertyDecorator =>
  Reflect.metadata(STATE_MACHINE_STORE, graphName);
