import { StateStore } from '../../lib';

export class Project {
  name: string = 'Test';

  @StateStore('project')
  state: string = 'new';
}
