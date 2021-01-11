import { Module } from '@nestjs/common';
import { StateMachineModule } from '../../lib';

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
  providers: [],
})
export class AppModule {}
