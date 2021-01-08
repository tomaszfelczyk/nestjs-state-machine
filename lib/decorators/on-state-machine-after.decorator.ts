import { SetMetadata } from '@nestjs/common';
import { OnEventMetadata } from '@nestjs/event-emitter';

export const OnStateMachineAfter = (
  graphName: string = '*',
  transitionName: string = '*',
  async: boolean = false,
): MethodDecorator =>
  SetMetadata('EVENT_LISTENER_METADATA', {
    event: `state-machine.${graphName}.after.${transitionName}`,
    options: { async },
  } as OnEventMetadata);
