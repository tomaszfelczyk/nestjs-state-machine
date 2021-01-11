import { EnterStateEvent, OnEnter, OnTransition } from '../../../lib';
import {
  ProjectState,
  ProjectTransition,
  PROJECT_SM_GRAPH,
} from '../constance';
import { Project } from '../project.model';

export class EnterListener {
  @OnEnter(PROJECT_SM_GRAPH, ProjectState.IN_PROGRESS)
  handle(event: EnterStateEvent<Project>) {
    event.subject.enter = true;
  }
}
