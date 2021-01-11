import { CompletedTransitionEvent, OnCompleted } from '../../../lib';
import { ProjectTransition, PROJECT_SM_GRAPH } from '../constance';
import { Project } from '../project.model';

export class CompletedListener {
  @OnCompleted(PROJECT_SM_GRAPH, ProjectTransition.START)
  handle(event: CompletedTransitionEvent<Project>) {
    event.subject.completed = true;
  }
}
