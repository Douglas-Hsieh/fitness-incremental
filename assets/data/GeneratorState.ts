import { Map } from 'immutable';

export interface GeneratorState {
  owned: number; // # of generators
  ticks: number; // # of accumulated ticks
  hasManager: boolean;
  isManuallyOperating: boolean;
}

export const INITIAL_GENERATOR_STATE_BY_ID = Map<string, GeneratorState>([
  ["1", { owned: 1, ticks: 0, hasManager: false, isManuallyOperating: false }],
  ["2", { owned: 0, ticks: 0, hasManager: false, isManuallyOperating: false }],
  ["3", { owned: 0, ticks: 0, hasManager: false, isManuallyOperating: false }],
  ["4", { owned: 0, ticks: 0, hasManager: false, isManuallyOperating: false }],
  ["5", { owned: 0, ticks: 0, hasManager: false, isManuallyOperating: false }],
  ["6", { owned: 0, ticks: 0, hasManager: false, isManuallyOperating: false }],
  ["7", { owned: 0, ticks: 0, hasManager: false, isManuallyOperating: false }],
  ["8", { owned: 0, ticks: 0, hasManager: false, isManuallyOperating: false }],
  ["9", { owned: 0, ticks: 0, hasManager: false, isManuallyOperating: false }],
  ["10", { owned: 0, ticks: 0, hasManager: false, isManuallyOperating: false }],
]);
