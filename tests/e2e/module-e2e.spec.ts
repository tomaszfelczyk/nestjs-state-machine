import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { StateMachineFactory } from '../../lib';
import { TransitionBlockedByGuardException } from '../../lib/exceptions/transition-blocked-by-guard.exception';
import { StateMachine } from '../../lib/state-machine';
import { AppModule } from '../src/app.module';
import { ProjectTransition, PROJECT_SM_GRAPH } from '../src/constance';
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
    subject = new Project();
    stateMachineFactory = app.get(StateMachineFactory);
    projectStateMachine = stateMachineFactory.create<Project>(
      subject,
      PROJECT_SM_GRAPH,
    );
    await app.init();
  });

  // TODO: naming
  it(`can start project - in progress`, async () => {
    expect(await projectStateMachine.can(ProjectTransition.START)).toBeTruthy();
  });

  it(`can finish new project - done`, async () => {
    expect(
      await projectStateMachine.can(ProjectTransition.FINISH),
    ).toBeTruthy();
  });

  it(`can't archive new project`, async () => {
    expect(
      await projectStateMachine.can(ProjectTransition.ARCHIVE),
    ).toBeFalsy();
  });

  // Guard non blocking
  it(`pass transition by guard`, async () => {
    expect(await projectStateMachine.can(ProjectTransition.START)).toBeTruthy();
  });

  // Guard blocking
  it(`block transition by guard`, async () => {
    subject.name = 'blockme';
    expect(await projectStateMachine.can(ProjectTransition.START)).toBeFalsy();
  });

  // Guard blocking (exception in transition)
  it(`block transition by guard (exception)`, async () => {
    subject.name = 'blockme';
    await expect(
      projectStateMachine.apply(ProjectTransition.START),
    ).rejects.toThrow(TransitionBlockedByGuardException);
  });

  // Events
  it(`project start`, async () => {
    await projectStateMachine.apply(ProjectTransition.START);

    expect(subject.leave).toBeTruthy();
    expect(subject.transition).toBeTruthy();
    expect(subject.enter).toBeTruthy();
    expect(subject.entered).toBeTruthy();
    expect(subject.completed).toBeTruthy();
  });

  // Announce
  it(`announce new transitions`, async () => {
    await projectStateMachine.apply(ProjectTransition.START);
    await projectStateMachine.apply(ProjectTransition.FINISH);
    expect(subject.announcedTranstitionNames).toEqual([
      ProjectTransition.FINISH,
      ProjectTransition.ARCHIVE,
    ]);
  });

  // Available Transitions
  it(`has available transitions`, async () => {
    await projectStateMachine.apply(ProjectTransition.START);
    const availableTransitionNames = await projectStateMachine
      .getAvailableTransitions()
      .then(transitions => {
        return transitions.map(transition => transition.name);
      });
    expect(availableTransitionNames).toEqual([ProjectTransition.FINISH]);
  });

  // Available Non Blocked Transitions
  it(`has available non-blocked transitions`, async () => {
    subject.name = 'blockme';
    const availableTransitionNames = await projectStateMachine
      .getAvailableTransitions()
      .then(transitions => {
        return transitions.map(transition => transition.name);
      });
    expect(availableTransitionNames).toEqual([ProjectTransition.FINISH]);
  });

  afterEach(async () => {
    await app.close();
  });
});
