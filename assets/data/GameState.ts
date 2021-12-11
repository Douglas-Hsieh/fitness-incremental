import { Map } from 'immutable';

export interface GeneratorState {
  owned: number;  // # of generators
  progress: number;  // # of unspent steps
}
export interface GameState {
  balance: number;
  generatorStateById: Map<number, GeneratorState>;
  upgradesById: {};
  unlocksById: {};
}

export const INITIAL_GAME_STATE: GameState = {
  balance: 10000,
  generatorStateById: Map<number, GeneratorState>([
    [1, {owned: 1, progress: 0}],
    [2, {owned: 0, progress: 0}],
    [3, {owned: 0, progress: 0}],
    [4, {owned: 0, progress: 0}],
    [5, {owned: 0, progress: 0}],
    [6, {owned: 0, progress: 0}],
    [7, {owned: 0, progress: 0}],
    [8, {owned: 0, progress: 0}],
    [9, {owned: 0, progress: 0}],
    [10, {owned: 0, progress: 0}],
  ]),
  upgradesById: {},
  unlocksById: {},
}
