export interface TutorialState {
  firstGenerator1: boolean,
  firstGenerator2: boolean,
  firstGenerator3: boolean,
  ticks1: boolean,
  ticks2: boolean,
  secondGenerator: boolean,
  manager1: boolean,
  manager2: boolean,
  manager3: boolean,
  prestige: boolean,
}

export const INITIAL_TUTORIAL_STATE: TutorialState = {
  firstGenerator1: false,
  firstGenerator2: false,
  firstGenerator3: false,
  ticks1: false,
  ticks2: false,
  secondGenerator: false,
  manager1: false,
  manager2: false,
  manager3: false,
  prestige: false,
}