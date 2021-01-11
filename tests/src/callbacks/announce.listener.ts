import { LeaveStateEvent, OnAnnounce } from '../../../lib';
import { PROJECT_SM_GRAPH } from '../constance';
import { Project } from '../project.model';

export class AnnounceListener {
  @OnAnnounce(PROJECT_SM_GRAPH)
  handle(event: LeaveStateEvent<Project>) {
    event.subject.announcedTranstitionNames.push(event.transition.name);
  }
}
