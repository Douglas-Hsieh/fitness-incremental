import { Map, Set } from 'immutable';

export interface GeneratorState {
  owned: number;  // # of generators
  progress: number;  // # of unspent steps
}

export const INITIAL_GENERATOR_STATE_BY_ID = Map<string, GeneratorState>([
  ["1", {owned: 1, progress: 0}],
  ["2", {owned: 0, progress: 0}],
  ["3", {owned: 0, progress: 0}],
  ["4", {owned: 0, progress: 0}],
  ["5", {owned: 0, progress: 0}],
  ["6", {owned: 0, progress: 0}],
  ["7", {owned: 0, progress: 0}],
  ["8", {owned: 0, progress: 0}],
  ["9", {owned: 0, progress: 0}],
  ["10", {owned: 0, progress: 0}],
])

export class GameState {
  balance: number;
  prestige: number;
  spentPrestige: number;  // since last reset
  startingLifetimeEarnings: number;  // since last reset
  lifetimeEarnings: number;  // since beginning
  generatorStateById: Map<string, GeneratorState>;
  upgradeIds: Set<string>;
  unlockIds: Set<string>;
  ticks: number;  // Intermediate currency generated from user taking steps
  steps: number;  // Steps user has taken
  stepsUntilNextRandomReward: number;

  constructor (
    balance: number,
    prestige: number,
    spentPrestige: number,
    startingLifetimeEarnings: number,
    lifetimeEarnings: number,
    generatorStateById: Map<string, GeneratorState>,
    upgradeIds: Set<string>,
    unlockIds: Set<string>,
    ticks: number,
    steps: number,
    stepsUntilNextRandomReward: number,
  ) {
    this.balance = balance
    this.prestige = prestige
    this.spentPrestige = spentPrestige
    this.startingLifetimeEarnings = startingLifetimeEarnings
    this.lifetimeEarnings = lifetimeEarnings
    this.generatorStateById = generatorStateById
    this.upgradeIds = upgradeIds
    this.unlockIds = unlockIds
    this.ticks = ticks
    this.steps = steps
    this.stepsUntilNextRandomReward = stepsUntilNextRandomReward
  }

  static fromJson(gameStateString: string) {
    const obj = JSON.parse(gameStateString) as GameState
    return new GameState(
      obj.balance,
      obj.prestige,
      obj.spentPrestige,
      obj.startingLifetimeEarnings,
      obj.lifetimeEarnings,
      Map(obj.generatorStateById),
      Set(obj.upgradeIds),
      Set(obj.unlockIds),
      obj.ticks,
      obj.steps,
      obj.stepsUntilNextRandomReward,
    )
  }
}

export const INITIAL_GAME_STATE = new GameState(
  1e+9,
  0,
  0,
  0,
  0,
  INITIAL_GENERATOR_STATE_BY_ID,
  Set(),
  Set(),
  0,
  0,
  5000,
)