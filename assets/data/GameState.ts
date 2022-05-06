import { Map, Set, List } from 'immutable';
import { FitnessLocation } from '../../src/shared/fitness-locations.interface';
import { TemporaryMultiplier } from '../../src/types/TemporaryMultiplier';
import { GeneratorState, INITIAL_GENERATOR_STATE_BY_ID } from './GeneratorState';
import { User } from '../../src/shared/users.interface';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { K } from '../../src/math/prestige';
import { Visit } from './Visit';
import { TICKS_PER_STEP } from './Constants';
import { INITIAL_UPGRADE_STATE, UpgradeState } from './UpgradeState';
import { INITIAL_TUTORIAL_STATE, TutorialState } from './TutorialState';
import { FitnessReward } from '../../src/rewards';

export class GameState {
  user: User | undefined;
  balance: number;
  prestige: number;
  spentPrestige: number;  // since last reset
  lastSessionEarnings: number;
  sessionEarnings: number;
  generatorStateById: Map<string, GeneratorState>;
  upgradeState: UpgradeState;
  unlockIds: Set<string>;
  ticks: number;  // Intermediate currency generated from user taking steps
  stepsRewardTimes: List<Date>;  // Step rewards were given at these times
  lifetimeSteps: number;
  permanentMultiplier: number;
  temporaryMultipliers: Set<TemporaryMultiplier>;
  lastWorkoutRewardTime: Date;
  lastPushNotificationTime: Date;
  speed: number;  // Tick usage multiplier
  visitHistory: List<Visit>;
  tutorialState: TutorialState;
  fitnessRewardsByDate: Map<string, FitnessReward>;  // YYYY-MM-DD formatted date

  constructor (
    user: User | undefined,
    balance: number,
    prestige: number,
    spentPrestige: number,
    lastSessionEarnings: number,
    sessionEarnings: number,
    generatorStateById: Map<string, GeneratorState>,
    upgradeState: UpgradeState,
    unlockIds: Set<string>,
    ticks: number,
    stepsRewardTimes: List<Date>,
    lifetimeSteps: number,
    permanentMultiplier: number,
    temporaryMultipliers: Set<TemporaryMultiplier>,
    lastWorkoutRewardTime: Date,
    lastPushNotificationTime: Date,
    speed: number,
    visitHistory: List<Visit>,
    tutorialState: TutorialState,
    fitnessHistory: Map<string, FitnessReward>
  ) {
    this.user = user
    this.balance = balance
    this.prestige = prestige
    this.spentPrestige = spentPrestige
    this.lastSessionEarnings = lastSessionEarnings
    this.sessionEarnings = sessionEarnings
    this.generatorStateById = generatorStateById
    this.upgradeState = upgradeState
    this.unlockIds = unlockIds
    this.ticks = ticks
    this.stepsRewardTimes = stepsRewardTimes
    this.lifetimeSteps = lifetimeSteps
    this.permanentMultiplier = permanentMultiplier
    this.temporaryMultipliers = temporaryMultipliers
    this.lastWorkoutRewardTime = lastWorkoutRewardTime
    this.lastPushNotificationTime = lastPushNotificationTime
    this.speed = speed
    this.visitHistory = visitHistory
    this.tutorialState = tutorialState
    this.fitnessRewardsByDate = fitnessHistory
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
      obj.upgradeState === undefined ? new UpgradeState() : UpgradeState.fromJson(obj.upgradeState),
      Set(obj.unlockIds),
      obj.ticks,
      obj.stepsRewardTimes === undefined ? INITIAL_STEPS_REWARD_TIMES : List(obj.stepsRewardTimes).map(time => new Date(time)),
      obj.lifetimeSteps,
      obj.permanentMultiplier === undefined ? INITIAL_PERMANENT_MULTIPLIER : obj.permanentMultiplier,
      Set(obj.temporaryMultipliers),
      obj.lastWorkoutRewardTime === undefined ? INITIAL_LAST_WORKOUT_REWARD_TIME : new Date(obj.lastWorkoutRewardTime),  // handling old saves
      obj.lastPushNotificationTime === undefined ? INITIAL_LAST_PUSH_NOTIFICATION_TIME : new Date(obj.lastPushNotificationTime),
      obj.speed === undefined ? INITIAL_SPEED : obj.speed,
      obj.visitHistory === undefined ? INITIAL_VISIT_HISTORY : List(obj.visitHistory).map(visit => Visit.fromJson(visit)),
      obj.tutorialState === undefined ? INITIAL_TUTORIAL_STATE : obj.tutorialState,
      obj.fitnessRewardsByDate === undefined ? INITIAL_FITNESS_REWARDS_BY_DATE : Map(obj.fitnessRewardsByDate).map(fr => FitnessReward.fromJson(fr)),
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
const INITIAL_TICKS = TICKS_PER_STEP * 5000
const INITIAL_PERMANENT_MULTIPLIER = 1
const INITIAL_LAST_WORKOUT_REWARD_TIME = new Date(0)
const INITIAL_LAST_PUSH_NOTIFICATION_TIME = new Date(0)
const INITIAL_SPEED = 1
const INITIAL_VISIT_HISTORY = List<Visit>()
const INITIAL_FITNESS_REWARDS_BY_DATE = Map<string, FitnessReward>()

export const INITIAL_GAME_STATE = new GameState(
  INITIAL_USER,
  INITIAL_BALANCE,
  INITIAL_PRESTIGE,
  0,
  0,
  0,
  INITIAL_GENERATOR_STATE_BY_ID,
  INITIAL_UPGRADE_STATE,
  Set(),
  INITIAL_TICKS,
  INITIAL_STEPS_REWARD_TIMES,
  0,
  INITIAL_PERMANENT_MULTIPLIER,
  Set(),
  INITIAL_LAST_WORKOUT_REWARD_TIME,
  INITIAL_LAST_PUSH_NOTIFICATION_TIME,
  INITIAL_SPEED,
  INITIAL_VISIT_HISTORY,
  INITIAL_TUTORIAL_STATE,
  INITIAL_FITNESS_REWARDS_BY_DATE,
)

const DEBUG_BALANCE = 0
const DEBUG_PRESTIGE = 1e+7
const DEBUG_LAST_SESSION_EARNINGS = K * Math.pow(DEBUG_PRESTIGE, 2)
const DEBUG_TICKS = 1e+6

export const DEBUG_GAME_STATE = new GameState(
  INITIAL_USER,
  DEBUG_BALANCE,
  DEBUG_PRESTIGE,
  0,
  DEBUG_LAST_SESSION_EARNINGS,
  0,
  INITIAL_GENERATOR_STATE_BY_ID,
  INITIAL_UPGRADE_STATE,
  Set(),
  DEBUG_TICKS,
  INITIAL_STEPS_REWARD_TIMES,
  0,
  INITIAL_PERMANENT_MULTIPLIER,
  Set(),
  INITIAL_LAST_WORKOUT_REWARD_TIME,
  INITIAL_LAST_PUSH_NOTIFICATION_TIME,
  INITIAL_SPEED,
  INITIAL_VISIT_HISTORY,
  INITIAL_TUTORIAL_STATE,
  INITIAL_FITNESS_REWARDS_BY_DATE,
)