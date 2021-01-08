import { SetMetadata } from '@nestjs/common';
import { OnEventMetadata } from '@nestjs/event-emitter';

export const OnStateMachineBefore = (
  graphName: string = '*',
  transitionName: string = '*',
  async: boolean = false,
): MethodDecorator =>
  SetMetadata('EVENT_LISTENER_METADATA', {
    event: `state-machine.${graphName}.before.${transitionName}`,
    options: { async },
  } as OnEventMetadata);
