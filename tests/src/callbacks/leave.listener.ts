import { LeaveStateEvent, OnLeave } from '../../../lib';
import { ProjectState, PROJECT_SM_GRAPH } from '../constance';
import { Project } from '../project.model';

export class LeaveListener {
  @OnLeave(PROJECT_SM_GRAPH, ProjectState.NEW)
  handle(event: LeaveStateEvent<Project>) {
    event.subject.leave = true;
  }
}
