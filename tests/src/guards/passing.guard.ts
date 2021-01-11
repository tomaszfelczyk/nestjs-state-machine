import { GuardEvent, OnGuard } from '../../../lib';
import { PROJECT_SM_GRAPH } from '../constance';
import { Project } from '../project.model';

export class PassingGuard {
  @OnGuard(PROJECT_SM_GRAPH, ProjectTransition.START)
  handle(event: GuardEvent<Project>) {
    // nothing
  }
}
