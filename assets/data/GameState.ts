import { Map } from 'immutable';

export interface GeneratorState {
  owned: number;  // # of generators
  progress: number;  // # of unspent steps
}

const INITIAL_GENERATOR_STATE: GeneratorState = {
  owned: 0,
  progress: 0,
}

export interface GameState {
  balance: number;
  generatorStateById: Map<number, GeneratorState>;
  upgradesById: {};
}

export const INITIAL_GAME_STATE: GameState = {
  balance: 1000000,
  generatorStateById: Map<number, GeneratorState>([
    [1, {owned: 1, progress: 0}],
    [2, INITIAL_GENERATOR_STATE],
    [3, INITIAL_GENERATOR_STATE],
    [4, INITIAL_GENERATOR_STATE],
    [5, INITIAL_GENERATOR_STATE],
    [6, INITIAL_GENERATOR_STATE],
    [7, INITIAL_GENERATOR_STATE],
    [8, INITIAL_GENERATOR_STATE],
    [9, INITIAL_GENERATOR_STATE],
    [10, INITIAL_GENERATOR_STATE],
  ]),
  upgradesById: {}
}