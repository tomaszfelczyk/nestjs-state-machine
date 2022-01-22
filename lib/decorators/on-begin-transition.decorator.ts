import { SetMetadata } from '@nestjs/common';
import { OnEventMetadata } from '@nestjs/event-emitter';

export const OnBeginTransition = (
  graphName = '*',
  state = '*',
  async = false,
): MethodDecorator =>
  SetMetadata('EVENT_LISTENER_METADATA', {
    event: `state-machine.${graphName}.transition.${state}`,
    options: { async },
  } as OnEventMetadata);
