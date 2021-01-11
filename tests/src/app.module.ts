import { Module } from '@nestjs/common';
import { StateMachineModule } from '../../lib';
import { LeaveListener } from './callbacks/leave.listener';
import { TransitionListener } from './callbacks/transition.listener';
import { EnterListener } from './callbacks/enter.listener';

import { BlockingGuard } from './guards/blocking.guard';
import { EnteredListener } from './callbacks/entered.listener';
import { CompletedListener } from './callbacks/completed.listener';
import { AnnounceListener } from './callbacks/announce.listener';

@Module({
  imports: [
    StateMachineModule.forRoot([
      {
        name: 'project',
        initialState: 'new',
        states: ['new', 'in-progress', 'done', 'archived'],
        transitions: [
          {
            name: 'start',
            from: ['new'],
            to: 'in-progress',
          },
          {
            name: 'finish',
            from: ['new', 'in-progress'],
            to: 'done',
          },
          {
            name: 'archive',
            from: ['done'],
            to: 'archived',
          },
        ],
      },
    ]),
  ],
  providers: [
    BlockingGuard,
    LeaveListener,
    TransitionListener,
    EnterListener,
    EnteredListener,
    CompletedListener,
    AnnounceListener,
  ],
})
export class AppModule {}
