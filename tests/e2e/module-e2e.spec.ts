import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { StateMachineFactory } from '../../lib';
import { StateMachine } from '../../lib/state-machine';
import { AppModule } from '../src/app.module';
import { Project } from '../src/project.model';

describe('StateMachineModule - e2e', () => {
  let app: INestApplication;

  let stateMachineFactory: StateMachineFactory;

  let projectStateMachine: StateMachine<Project>;

  let subject: Project = new Project();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    stateMachineFactory = app.get(StateMachineFactory);
    projectStateMachine = stateMachineFactory.create<Project>(
      subject,
      'project',
    );
    await app.init();
  });

  // TODO: naming
  it(`can start project - in progress`, async () => {
    expect(await projectStateMachine.can('start')).toBeTruthy();
  });

  it(`can finish project - done`, async () => {
    expect(await projectStateMachine.can('finish')).toBeTruthy();
  });

  it(`can't archive new project`, async () => {
    expect(await projectStateMachine.can('archive')).toBeFalsy();
  });

  // Guard non blocking

  // Guard blocking

  // leave

  // transition

  // enter

  // entered

  // complete

  // announce

  // create contances / tokens file

  afterEach(async () => {
    await app.close();
  });
});
