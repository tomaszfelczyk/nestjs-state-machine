import { LeaveStateEvent, OnAnnounceTransitions } from '../../../lib';
import { PROJECT_SM_GRAPH } from '../constance';
import { Project } from '../project.model';

export class AnnounceListener {
  @OnAnnounceTransitions(PROJECT_SM_GRAPH)
  handle(event: LeaveStateEvent<Project>) {
    event.subject.announcedTranstitionNames.push(event.transition.name);
  }
}
