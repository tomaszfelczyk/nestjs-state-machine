import { BeginTransitionEvent, OnBeginTransition } from '../../../lib';
import { ProjectTransition, PROJECT_SM_GRAPH } from '../constance';
import { Project } from '../project.model';

export class TransitionListener {
  @OnBeginTransition(PROJECT_SM_GRAPH, ProjectTransition.START)
  handle(event: BeginTransitionEvent<Project>) {
    event.subject.transition = true;
  }
}
