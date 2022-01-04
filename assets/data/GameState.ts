import { Map, Set } from 'immutable';
import { TemporaryMultiplier } from '../../src/types/TemporaryMultiplier';

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
  stepsUntilNextRandomReward: number;
  lifetimeSteps: number;
  temporaryMultipliers: Set<TemporaryMultiplier>;

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
    stepsUntilNextRandomReward: number,
    lifetimeSteps: number,
    temporaryMultipliers: Set<TemporaryMultiplier>,
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
    this.stepsUntilNextRandomReward = stepsUntilNextRandomReward
    this.lifetimeSteps = lifetimeSteps
    this.temporaryMultipliers = temporaryMultipliers
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
      obj.stepsUntilNextRandomReward,
      obj.lifetimeSteps,
      Set(obj.temporaryMultipliers),
    )
  }
}

export const INITIAL_BALANCE = 1e+50
export const INITIAL_STEPS_UNTIL_NEXT_RANDOM_REWARD = 5000
const INITIAL_TICKS = 1e+5

export const INITIAL_GAME_STATE = new GameState(
  INITIAL_BALANCE,
  0,
  0,
  0,
  0,
  INITIAL_GENERATOR_STATE_BY_ID,
  Set(),
  Set(),
  INITIAL_TICKS,
  INITIAL_STEPS_UNTIL_NEXT_RANDOM_REWARD,
  0,
  Set(),
)
