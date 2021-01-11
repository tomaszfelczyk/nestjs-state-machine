## Description

Nestjs State Machine module for [Nest](https://github.com/nestjs/nest).

## Getting started

Install package:
```bash
$ npm i --save @depthlabs/nestjs-state-machine
```

After installation, import StateMachineModule into your root module with state machinge graph configurations ex.:
```typescript
// app.module.ts
import { StateMachineModule } from '@depthlabs/nestjs-state-machine';

@Module({
  imports: [
    // .forRoot takes array of graph configurations
    StateMachineModule.forRoot([
        {
            // Name of graph
            name: 'project-graph',
            // Initial state of graph
            initialState: 'new',
            // Available states in graph
            states: ['new', 'in-progress', 'done'],
            // Available transitions in graph
            transitions: [
                {
                    // Name of transistion
                    name: 'start',
                    // Source states
                    from: ['new'],
                    // Target state of transition
                    to: 'in-progress',
                },
                {
                    name: 'finish',
                    from: ['in-progress'],
                    to: 'done',
                }
            ],
        },
    ]),
  ]
})
export class AppModule {}
```

It's good idea to define graph, state and transition names in one place ex.:
```typescript
// constants.ts
export const PROJECT_GRAPH = 'project-graph'

export enum ProjectState {
    NEW = 'new',
    IN_PROGRESS = 'in-progress',
    DONE = 'done'
}

export enum ProjectTransition {
    START = 'start',
    FINISH = 'finish'
}

```

and then:

```typescript
import { PROJECT_GRAPH, ProjectState, ProjectTransition } from './constants';

// ...

StateMachineModule.forRoot([{
    name: PROJECT_GRAPH,
    initialState: ProjectState.NEW,
    states: [ProjectState.NEW, ProjectState.IN_PROGRESS, ProjectState.DONE],
    transitions: [
        {
            name: ProjectTransition.START,
            from: [ProjectState.NEW],
            to: ProjectState.IN_PROGRESS,
        },
        {
            name: ProjectTransition.FINISH,
            from: [ProjectState.IN_PROGRESS],
            to: ProjectState.DONE,
        }
    ],
}]);
```

Next, create model or use your exisiting model and decorate property which will be responsible for storing state of model:
```typescript
// project.model.ts
import { StateStore } from '@depthlabs/nestjs-state-machine';
import { PROJECT_GRAPH, ProjectState } from './constants';

export class Project {
    name: string;

    @StateStore(PROJECT_GRAPH)
    state: string = ProjectState.NEW;

}
```
`@StateStore` takes one argument with graph name (string). Thanks to this one model can handle more then one graph: 
```typescript
@StateStore(PROJECT_GRAPH)
state: string = ProjectState.NEW;

@StateStore(PROJECT_TASKS_GRAPH)
taskState: string = ProjectTasksState.NEW;
```

At this point we can use our state machine.
To create state machine, first inject `StateMachineFactory` using standard constructor injection:


```typescript
import { StateMachineFactory } from '@depthlabs/nestjs-state-machine';
import { PROJECT_GRAPH, ProjectTransition } from './constants';
import { Project } from './project.model'

constructor(
    private readonly stateMachineFactory: StateMachineFactory,
) {}
```

Create state machine with instance of Project model as subject (in first argument) and with graph name in second.
```typescript
const projectStateMachine = this.stateMachineFactory.create<Project>(project, PROJECT_GRAPH)
```
    
Apply transition:
```typescript
// takes transition name in argument
await projectStateMachine.apply(ProjectTransition.START)
// return void but project.state is now equal ProjectState.IN_PROGRESS
```

Check if transition is possible:
```typescript
// takes transition name in argument
await projectStateMachine.can(ProjectTransition.START)
// return true or false, can() don't throw Errors
```

Get all possible transitions:
```typescript
await projectStateMachine.getAvailableTransitions()
// return TransitionInterface[];
```
    
## Guards

You can create guards to block transitions and callback/listeners to do additional actions when a state machine operation happened (e.g. sending emails, recalculate).

To declare an `Guard`, decorate a method with the `@OnGuard()` decorator:

```typescript
import { GuardEvent, OnGuard } from '@depthlabs/nestjs-state-machine';
import { ProjectTransition, PROJECT_GRAPH } from '../constance';
import { Project } from '../project.model';

export class ProjectCantBeNamedBlockmeGuard {

    // Graph name in first argument, transition name in second
    @OnGuard(PROJECT_GRAPH, ProjectTransition.START)
    handle(event: GuardEvent<Project>) {
        // event.subject is our Project instance
        if (event.subject.name == 'blockme') { // if name isn't allowed for some reasons
            event.setBlocked('transition-blocked'); // block transition using setBlocked() method
        }
    }

}
```
Than you need to register `ProjectCantBeNamedBlockmeGuard` in module as provider:
```typescript
@Module({
    imports: [
        StateMachineModule.forRoot([
            // ...
        ])
    ],
    providers: [
        ProjectCantBeNamedBlockmeGuard
    ],
})
export class AppModule {}
```

Now, if you create `StateMachine` instance and try to apply `START` transition you will get:
```typescript
const project = new Project()
project.name = 'blockme'

const projectStateMachine = this.stateMachineFactory.create<Project>(project, PROJECT_GRAPH);

await projectStateMachine.can(ProjectTransition.START)
// false

await projectStateMachine.apply(ProjectTransition.START)
// Throw TransitionBlockedByGuardException with .blockingReasons property that contain ['transition-blocked']

projectStateMachine.getAvailableTransitions()
// [] - empty
```

## Callbacks

When a state transition is initiated, the callbakcs are dispatched in the following order:  
`LeaveState` - The subject is about to leave a place  
`BeginTransition` - The subject is going through this transition.  
`EnterState` - The subject is about to enter a new place. This event is triggered right before the subject places are updated.  
  
Change of state on subject.  

`EnteredState` - The subject has entered in the places and the marking is updated.  
`CompletedTransition` - The object has completed this transition.  
`AnnounceTransitions` - Triggered for each transition that now is accessible for the subject.

Example:
```typescript
import { OnCompletedTransition, CompletedTransitionEvent } from '@depthlabs/nestjs-state-machine';
import { ProjectTransition, PROJECT_GRAPH } from '../constance';
import { Project } from '../project.model';

export class NotifyTeamAboutFinishedTask {

    // Graph name in first argument, transition name in second. Third if truem method is async.
    @OnCompletedTransition(PROJECT_GRAPH, ProjectTransition.FINISH, true)
    async handle(event: BeginTransitionEvent<Project>) {
        // Send emails to all users in team
    }

}
```
and of course:
```typescript
@Module({
    // ...
    providers: [
        NotifyTeamAboutFinishedTask
    ],
    // ...
})
export class AppModule {}
```


## License

Nestjs State Machine is [MIT licensed](LICENSE).