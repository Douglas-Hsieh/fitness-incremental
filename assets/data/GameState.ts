import { Map, Set, List } from 'immutable';
import { FitnessLocation } from '../../src/shared/fitness-locations.interface';
import { TemporaryMultiplier } from '../../src/types/TemporaryMultiplier';
import { GeneratorState, INITIAL_GENERATOR_STATE_BY_ID } from './GeneratorState';
import { User } from '../../src/shared/users.interface';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { K } from '../../src/math/prestige';
import { Visit } from './Visit';

export class GameState {
  user: User | undefined;
  balance: number;
  prestige: number;
  spentPrestige: number;  // since last reset
  lastSessionEarnings: number;
  sessionEarnings: number;
  generatorStateById: Map<string, GeneratorState>;
  upgradeIds: Set<string>;
  unlockIds: Set<string>;
  ticks: number;  // Intermediate currency generated from user taking steps
  stepsRewardTimes: List<Date>;  // Step rewards were given at these times
  lifetimeSteps: number;
  temporaryMultipliers: Set<TemporaryMultiplier>;
  fitnessLocation: FitnessLocation | null;
  lastWorkoutRewardTime: Date;
  lastPushNotificationTime: Date;
  speed: number;  // Tick usage multiplier
  visitHistory: List<Visit>;

  constructor (
    user: User | undefined,
    balance: number,
    prestige: number,
    spentPrestige: number,
    lastSessionEarnings: number,
    sessionEarnings: number,
    generatorStateById: Map<string, GeneratorState>,
    upgradeIds: Set<string>,
    unlockIds: Set<string>,
    ticks: number,
    stepsRewardTimes: List<Date>,
    lifetimeSteps: number,
    temporaryMultipliers: Set<TemporaryMultiplier>,
    fitnessLocation: FitnessLocation | null,
    lastWorkoutRewardTime: Date,
    lastPushNotificationTime: Date,
    speed: number,
    visitHistory: List<Visit>,
  ) {
    this.user = user
    this.balance = balance
    this.prestige = prestige
    this.spentPrestige = spentPrestige
    this.lastSessionEarnings = lastSessionEarnings
    this.sessionEarnings = sessionEarnings
    this.generatorStateById = generatorStateById
    this.upgradeIds = upgradeIds
    this.unlockIds = unlockIds
    this.ticks = ticks
    this.stepsRewardTimes = stepsRewardTimes
    this.lifetimeSteps = lifetimeSteps
    this.temporaryMultipliers = temporaryMultipliers
    this.fitnessLocation = fitnessLocation
    this.lastWorkoutRewardTime = lastWorkoutRewardTime
    this.lastPushNotificationTime = lastPushNotificationTime
    this.speed = speed
    this.visitHistory = visitHistory
  }

  static fromJson(gameStateString: string) {
    const obj = JSON.parse(gameStateString) as GameState
    return new GameState(
      obj.user,
      obj.balance,
      obj.prestige,
      obj.spentPrestige,
      obj.lastSessionEarnings,
      obj.sessionEarnings,
      Map(obj.generatorStateById),
      Set(obj.upgradeIds),
      Set(obj.unlockIds),
      obj.ticks,
      obj.stepsRewardTimes === undefined ? INITIAL_STEPS_REWARD_TIMES : List(obj.stepsRewardTimes).map(time => new Date(time)),
      obj.lifetimeSteps,
      Set(obj.temporaryMultipliers),
      obj.fitnessLocation,
      obj.lastWorkoutRewardTime === undefined ? INITIAL_LAST_WORKOUT_REWARD_TIME : new Date(obj.lastWorkoutRewardTime),  // handling old saves
      obj.lastPushNotificationTime === undefined ? INITIAL_LAST_PUSH_NOTIFICATION_TIME : new Date(obj.lastPushNotificationTime),
      obj.speed === undefined ? INITIAL_SPEED : obj.speed,
      obj.visitHistory === undefined ? INITIAL_VISIT_HISTORY : List(obj.visitHistory).map(visit => Visit.fromJson(visit)),
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
export const INITIAL_STEPS_REWARD_TIMES = List<Date>()
const INITIAL_TICKS = 0
const INITIAL_LAST_WORKOUT_REWARD_TIME = new Date(0)
const INITIAL_LAST_PUSH_NOTIFICATION_TIME = new Date(0)
const INITIAL_SPEED = 1
const INITIAL_VISIT_HISTORY = List<Visit>()

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
  INITIAL_STEPS_REWARD_TIMES,
  0,
  Set(),
  null,
  INITIAL_LAST_WORKOUT_REWARD_TIME,
  INITIAL_LAST_PUSH_NOTIFICATION_TIME,
  INITIAL_SPEED,
  INITIAL_VISIT_HISTORY,
)

const DEBUG_BALANCE = 0
const DEBUG_PRESTIGE = 1e+7
const DEBUG_LAST_SESSION_EARNINGS = K * Math.pow(DEBUG_PRESTIGE, 2)
const DEBUG_TICKS = 1e+100

export const DEBUG_GAME_STATE = new GameState(
  INITIAL_USER,
  DEBUG_BALANCE,
  DEBUG_PRESTIGE,
  0,
  DEBUG_LAST_SESSION_EARNINGS,
  0,
  INITIAL_GENERATOR_STATE_BY_ID,
  Set(),
  Set(),
  DEBUG_TICKS,
  INITIAL_STEPS_REWARD_TIMES,
  0,
  Set(),
  null,
  INITIAL_LAST_WORKOUT_REWARD_TIME,
  INITIAL_LAST_PUSH_NOTIFICATION_TIME,
  INITIAL_SPEED,
  INITIAL_VISIT_HISTORY,
)