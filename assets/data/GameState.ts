import { Map, Set } from 'immutable';
import { FitnessLocation } from '../../../fitness-incremental-shared/src/fitness-locations.interface';
import { TemporaryMultiplier } from '../../src/types/TemporaryMultiplier';
import { GeneratorState, INITIAL_GENERATOR_STATE_BY_ID } from './GeneratorState';
import 'react-native-get-random-values';  // hacky: must be before uuid import
import { User } from '../../../fitness-incremental-shared/src/users.interface';

export class GameState {
  user: User | undefined;
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
  fitnessLocation: FitnessLocation | null;
  lastWorkoutRewardTime: Date;

  constructor (
    user: User | undefined,
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
    fitnessLocation: FitnessLocation | null,
    lastWorkoutRewardTime: Date,
  ) {
    this.user = user
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
    this.fitnessLocation = fitnessLocation
    this.lastWorkoutRewardTime = lastWorkoutRewardTime
  }

  static fromJson(gameStateString: string) {
    const obj = JSON.parse(gameStateString) as GameState
    return new GameState(
      obj.user,
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
      obj.fitnessLocation,
      obj.lastWorkoutRewardTime === undefined ? INITIAL_LAST_WORKOUT_REWARD_TIME : new Date(obj.lastWorkoutRewardTime),  // handling old saves
    )
  }
}

export const INITIAL_USER = undefined
// export const INITIAL_BALANCE = 0
export const INITIAL_BALANCE = 1e+50
export const INITIAL_PRESTIGE = 0
// export const INITIAL_PRESTIGE = 1e+50
export const INITIAL_STEPS_UNTIL_NEXT_RANDOM_REWARD = 5000
const INITIAL_TICKS = 1e+5
// const INITIAL_TICKS = 1000
const INITIAL_LAST_WORKOUT_REWARD_TIME = new Date(0)

export const INITIAL_GAME_STATE = new GameState(
  INITIAL_USER,
  INITIAL_BALANCE,
  INITIAL_PRESTIGE,
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
  null,
  INITIAL_LAST_WORKOUT_REWARD_TIME,
)
