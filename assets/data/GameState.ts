import { Map, Set } from 'immutable';

export interface GeneratorState {
  owned: number;  // # of generators
  progress: number;  // # of unspent steps
}

export const INITIAL_GENERATOR_STATE_BY_ID = Map<number, GeneratorState>([
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
])
export interface GameState {
  balance: number;
  prestige: number;
  spentPrestige: number;  // since last reset
  startingLifetimeEarnings: number;  // since last reset
  lifetimeEarnings: number;  // since beginning
  generatorStateById: Map<number, GeneratorState>;
  upgradeIds: Set<number>;
  unlockIds: Set<string>;
}

export const INITIAL_GAME_STATE: GameState = {
  balance: 0,
  prestige: 0,
  spentPrestige: 0,
  startingLifetimeEarnings: 0,
  lifetimeEarnings: 0,
  generatorStateById: INITIAL_GENERATOR_STATE_BY_ID,
  upgradeIds: Set(),
  unlockIds: Set(),
}
