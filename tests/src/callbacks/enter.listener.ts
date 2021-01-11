import { EnterStateEvent, OnEnteredState, OnEnterState } from '../../../lib';
import {
  ProjectState,
  ProjectTransition,
  PROJECT_SM_GRAPH,
} from '../constance';
import { Project } from '../project.model';

export class EnterListener {
  @OnEnterState(PROJECT_SM_GRAPH, ProjectState.IN_PROGRESS)
  handle(event: EnterStateEvent<Project>) {
    event.subject.enter = true;
  }
}
