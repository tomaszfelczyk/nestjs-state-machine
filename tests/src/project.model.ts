import { StateStore } from '../../lib';

export class Project {
  name: string = 'test project';

  @StateStore('project')
  state: string = 'new';

  leave: boolean = false;

  transition: boolean = false;

  enter: boolean = false;

  entered: boolean = false;

  completed: boolean = false;

  announcedTranstitionNames: string[] = [];
}
