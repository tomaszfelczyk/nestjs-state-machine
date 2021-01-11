import { GuardEvent, OnGuard } from '../../../lib';
import { ProjectTransition, PROJECT_SM_GRAPH } from '../constance';
import { Project } from '../project.model';

export class BlockingGuard {
  @OnGuard(PROJECT_SM_GRAPH, ProjectTransition.START)
  handle(event: GuardEvent<Project>) {
    if (event.subject.name == 'blockme') {
      event.setBlocked('transition-blocked');
    }
  }
}
