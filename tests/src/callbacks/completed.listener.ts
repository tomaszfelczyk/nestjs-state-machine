import { CompletedTransitionEvent, OnCompletedTransition } from '../../../lib';
import { ProjectTransition, PROJECT_SM_GRAPH } from '../constance';
import { Project } from '../project.model';

export class CompletedListener {
  @OnCompletedTransition(PROJECT_SM_GRAPH, ProjectTransition.START)
  handle(event: CompletedTransitionEvent<Project>) {
    event.subject.completed = true;
  }
}
