import { EnteredStateEvent, OnEntered } from '../../../lib';
import { ProjectState, PROJECT_SM_GRAPH } from '../constance';
import { Project } from '../project.model';

export class EnteredListener {
  @OnEntered(PROJECT_SM_GRAPH, ProjectState.IN_PROGRESS)
  handle(event: EnteredStateEvent<Project>) {
    event.subject.entered = true;
  }
}
