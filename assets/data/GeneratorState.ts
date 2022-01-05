import { Map } from 'immutable';

export interface GeneratorState {
  owned: number; // # of generators
  ticks: number; // # of accumulated ticks
}

export const INITIAL_GENERATOR_STATE_BY_ID = Map<string, GeneratorState>([
  ["1", { owned: 1, ticks: 0 }],
  ["2", { owned: 0, ticks: 0 }],
  ["3", { owned: 0, ticks: 0 }],
  ["4", { owned: 0, ticks: 0 }],
  ["5", { owned: 0, ticks: 0 }],
  ["6", { owned: 0, ticks: 0 }],
  ["7", { owned: 0, ticks: 0 }],
  ["8", { owned: 0, ticks: 0 }],
  ["9", { owned: 0, ticks: 0 }],
  ["10", { owned: 0, ticks: 0 }],
]);
