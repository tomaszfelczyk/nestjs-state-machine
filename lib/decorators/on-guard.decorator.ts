import { SetMetadata } from '@nestjs/common';
import { OnEventMetadata } from '@nestjs/event-emitter';

export const OnGuard = (
  graphName = '*',
  transitionName = '*',
): MethodDecorator =>
  SetMetadata('EVENT_LISTENER_METADATA', {
    event: `state-machine.${graphName}.guard.${transitionName}`,
  } as OnEventMetadata);
