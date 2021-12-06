export interface GeneratorState {
  count: number;  // # of generators
  steps: number;  // # of stored steps
}

export const INITIAL_GENERATOR_STATE = {
  count: 0,
  steps: 0,
}

const INITIAL_GAME_STATE = {
  currency: 0,
  generatorStateById: {
    1: 1,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
  }
}