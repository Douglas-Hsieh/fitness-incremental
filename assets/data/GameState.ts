import { Map, Set } from 'immutable';
import { FitnessLocation } from '../../src/shared/fitness-locations.interface';
import { TemporaryMultiplier } from '../../src/types/TemporaryMultiplier';
import { GeneratorState, INITIAL_GENERATOR_STATE_BY_ID } from './GeneratorState';
import { User } from '../../src/shared/users.interface';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class GameState {
  user: User | undefined;
  balance: number;
  prestige: number;
  spentPrestige: number;  // since last reset
  lifetimeEarningsSinceLastReset: number;  // since last reset
  lifetimeEarningsSinceBeginning: number;  // since beginning
  generatorStateById: Map<string, GeneratorState>;
  upgradeIds: Set<string>;
  unlockIds: Set<string>;
  ticks: number;  // Intermediate currency generated from user taking steps
  stepsUntilNextRandomReward: number;
  lifetimeSteps: number;
  temporaryMultipliers: Set<TemporaryMultiplier>;
  fitnessLocation: FitnessLocation | null;
  lastWorkoutRewardTime: Date;
  lastPushNotificationTime: Date;
  speed: number;  // Tick usage multiplier

  constructor (
    user: User | undefined,
    balance: number,
    prestige: number,
    spentPrestige: number,
    lifetimeEarningsSinceLastReset: number,
    lifetimeEarningsSinceBeginning: number,
    generatorStateById: Map<string, GeneratorState>,
    upgradeIds: Set<string>,
    unlockIds: Set<string>,
    ticks: number,
    stepsUntilNextRandomReward: number,
    lifetimeSteps: number,
    temporaryMultipliers: Set<TemporaryMultiplier>,
    fitnessLocation: FitnessLocation | null,
    lastWorkoutRewardTime: Date,
    lastPushNotificationTime: Date,
    speed: number,
  ) {
    this.user = user
    this.balance = balance
    this.prestige = prestige
    this.spentPrestige = spentPrestige
    this.lifetimeEarningsSinceLastReset = lifetimeEarningsSinceLastReset
    this.lifetimeEarningsSinceBeginning = lifetimeEarningsSinceBeginning
    this.generatorStateById = generatorStateById
    this.upgradeIds = upgradeIds
    this.unlockIds = unlockIds
    this.ticks = ticks
    this.stepsUntilNextRandomReward = stepsUntilNextRandomReward
    this.lifetimeSteps = lifetimeSteps
    this.temporaryMultipliers = temporaryMultipliers
    this.fitnessLocation = fitnessLocation
    this.lastWorkoutRewardTime = lastWorkoutRewardTime
    this.lastPushNotificationTime = lastPushNotificationTime
    this.speed = speed
  }

  static fromJson(gameStateString: string) {
    const obj = JSON.parse(gameStateString) as GameState
    return new GameState(
      obj.user,
      obj.balance,
      obj.prestige,
      obj.spentPrestige,
      obj.lifetimeEarningsSinceLastReset,
      obj.lifetimeEarningsSinceBeginning,
      Map(obj.generatorStateById),
      Set(obj.upgradeIds),
      Set(obj.unlockIds),
      obj.ticks,
      obj.stepsUntilNextRandomReward,
      obj.lifetimeSteps,
      Set(obj.temporaryMultipliers),
      obj.fitnessLocation,
      obj.lastWorkoutRewardTime === undefined ? INITIAL_LAST_WORKOUT_REWARD_TIME : new Date(obj.lastWorkoutRewardTime),  // handling old saves
      obj.lastPushNotificationTime === undefined ? INITIAL_LAST_PUSH_NOTIFICATION_TIME : new Date(obj.lastPushNotificationTime),
      obj.speed === undefined ? INITIAL_SPEED : obj.speed,
    )
  }

  static load = async () => {
    const gameStateString = await AsyncStorage.getItem('gameState')
    const gameState = gameStateString ? GameState.fromJson(gameStateString) : INITIAL_GAME_STATE
    return gameState
  }

  static save = async (gameState: GameState) => {
    AsyncStorage.setItem('gameState', JSON.stringify(gameState))
  }
}

export const INITIAL_USER = undefined
export const INITIAL_BALANCE = 0
export const INITIAL_PRESTIGE = 0
export const INITIAL_STEPS_UNTIL_NEXT_RANDOM_REWARD = 5000
const INITIAL_TICKS = 0
const INITIAL_LAST_WORKOUT_REWARD_TIME = new Date(0)
const INITIAL_LAST_PUSH_NOTIFICATION_TIME = new Date(0)
const INITIAL_SPEED = 1

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
  INITIAL_LAST_PUSH_NOTIFICATION_TIME,
  INITIAL_SPEED,
)

const DEBUG_BALANCE = 0
const DEBUG_PRESTIGE = 0
const DEBUG_TICKS = 1e+100

export const DEBUG_GAME_STATE = new GameState(
  INITIAL_USER,
  DEBUG_BALANCE,
  DEBUG_PRESTIGE,
  0,
  0,
  0,
  INITIAL_GENERATOR_STATE_BY_ID,
  Set(),
  Set(),
  DEBUG_TICKS,
  INITIAL_STEPS_UNTIL_NEXT_RANDOM_REWARD,
  0,
  Set(),
  null,
  INITIAL_LAST_WORKOUT_REWARD_TIME,
  INITIAL_LAST_PUSH_NOTIFICATION_TIME,
  INITIAL_SPEED,
)