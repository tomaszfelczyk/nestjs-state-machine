export const PROJECT_SM_GRAPH = 'project';

export enum ProjectState {
  NEW = 'new',
  IN_PROGRESS = 'in-progress',
  FINISHED = 'finished',
}

export enum ProjectTransition {
  START = 'start',
  FINISH = 'finish',
  ARCHIVE = 'archive',
}
