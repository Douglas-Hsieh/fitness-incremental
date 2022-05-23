import { LocationObject } from "expo-location";
import haversine from "haversine";
import { Map, Record } from "immutable"
import { STEP_REWARDS } from "../assets/data/Constants"
import { GameState } from "../assets/data/GameState";
import { dateToYYYYMMDDFormat, numberToHumanFormat } from "./math/formatting"
import { FitnessLocation, toLatLng } from "./shared/fitness-locations.interface";
import RewardModalDetails from "./types/RewardModalDetails";

class BaseReward {
  title: string;
  body: string;

  constructor(title: string, body: string) {
    this.title = title
    this.body = body
  }
}

export class RewardNothing extends BaseReward {}

export class RewardInstantBonus extends BaseReward {
  bonus: number;

  constructor(title: string, body: string, bonus: number) {
    super(title, body)
    this.bonus = bonus
  }
}

export class RewardTemporaryMultiplier extends BaseReward {
  multiplier: number;
  expirationDate: Date;

  constructor(title: string, body: string, multiplier: number, expirationDate: Date) {
    super(title, body)
    this.multiplier = multiplier
    this.expirationDate = expirationDate
  }
}

export class RewardPermanentMultiplier extends BaseReward {
  multiplier: number;

  constructor(title: string, body: string, multiplier: number) {
    super(title, body)
    this.multiplier = multiplier
  }
}

export const generateReward = (oneTickRevenue: number) => {
  const p = Math.random()

  if (p < 0.25) {
    return generateNothingReward()
  } else if (p < 0.5) {
    return generateInstantBonus(oneTickRevenue)
  } else if (p < 0.75) {
    return generateTemporaryMultiplier(5)
  } else {
    return generatePermanentMultiplier(3)
  }
}

export const generateNothingReward = () => {
  return new RewardNothing(
    'Nothing',
    'Better luck next time',
  )
}

export const generateInstantBonus = (oneTickRevenue: number) => {
  const bonus = 86400 * oneTickRevenue
  const [coefficient, scale] = numberToHumanFormat(bonus)

  return new RewardInstantBonus(
    'Instant Bonus',
    `You just gained ${coefficient} ${scale} steps!`,
    bonus,
  )
}

export const generateTemporaryMultiplier = (multiplier: number) => {
  const now = new Date()
  const oneDayLater = new Date(now.getTime() + 86400000)

  return new RewardTemporaryMultiplier(
    'Temporary Multiplier',
    `You will produce x${multiplier} as much for 24 hours!`,
    multiplier,
    oneDayLater,
  )
}

export const generatePermanentMultiplier = (multiplier: number) => {

  return new RewardPermanentMultiplier(
    'Permanent Multiplier',
    `You will now produce x${multiplier} as much!`,
    multiplier,
  )
}

/**
 * @param steps steps taken on this day
 * @param rewardsGiven rewards already given on this day
 * @returns number of rewards left to be given
 */
export const calculateStepRewardsLeft = (steps: number, rewardsGiven: number) => {
  const rewardsTotal = STEP_REWARDS
    .filter(stepReward => steps >= stepReward.steps)
    .map(stepReward => stepReward.rewards)
    .max()!
  return rewardsTotal - rewardsGiven
}

export function calculateStepRewardsLeftToday(fitnessRewardsByDate: Map<string, FitnessReward>) {
  const today = dateToYYYYMMDDFormat(new Date())
  const fitnessRewards = fitnessRewardsByDate.get(today)
  if (!fitnessRewards) return 0
  return calculateStepRewardsLeft(fitnessRewards.steps, fitnessRewards.stepRewards)
}

export const canReceiveWorkoutReward = (
  fitnessLocation: FitnessLocation,
  currentLocation: LocationObject,
  lastWorkoutRewardTime: Date,
  currentTime: Date
) => {
  if (!fitnessLocation.isVerified) {
    return false
  }

  const fitnessLocationLatLng = toLatLng(fitnessLocation);
  const isNearFitnessLocation = haversine(fitnessLocationLatLng, currentLocation.coords, { unit: 'mile', threshold: 0.25})
  const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000
  const diffTime = Math.abs(currentTime.getTime() - lastWorkoutRewardTime.getTime())
  const enoughTimeSinceLastReward = diffTime > EIGHT_HOURS_MS

  return isNearFitnessLocation && enoughTimeSinceLastReward
}

export function giveReward(reward: RewardNothing | RewardInstantBonus | RewardTemporaryMultiplier | RewardPermanentMultiplier, setGameState: React.Dispatch<React.SetStateAction<GameState>>) {
  if (reward instanceof RewardInstantBonus) {
    const { bonus } = reward
    setGameState(prevGameState => ({
      ...prevGameState,
      balance: prevGameState.balance + bonus,
      sessionEarnings: prevGameState.sessionEarnings + bonus,
    }))

  } else if (reward instanceof RewardTemporaryMultiplier) {
    const { multiplier, expirationDate } = reward
    setGameState(prevGameState => ({
      ...prevGameState,
      temporaryMultipliers: prevGameState.temporaryMultipliers.add({ multiplier, expirationDate }),
    }))
  } else if (reward instanceof RewardPermanentMultiplier) {
    const { multiplier } = reward
    setGameState(prevGameState => ({
      ...prevGameState,
      permanentMultiplier: prevGameState.permanentMultiplier * multiplier,
    }))
  }
}

export class FitnessReward extends Record({
  steps: 0,  // # of steps taken
  stepRewards: 0,  // # of rewards given for step count
  gymVisits: 0,
  gymVisitRewards: 0,
}) {
  static fromJson(fr: FitnessReward) {
    return new FitnessReward({
      steps: fr.steps,
      stepRewards: fr.stepRewards,
      gymVisits: fr.gymVisits,
      gymVisitRewards: fr.gymVisitRewards
    })
  }
}

export function displayReward(
  setRewardModalDetails: React.Dispatch<React.SetStateAction<RewardModalDetails | undefined>>,
  reward: RewardNothing | RewardInstantBonus | RewardTemporaryMultiplier,
  title: string,
  body: string,
  setShowOverlay: React.Dispatch<React.SetStateAction<boolean>>,
  setShowRewardModal: React.Dispatch<React.SetStateAction<boolean>>
) {
  setRewardModalDetails({
    reward: reward,
    title: title,
    body: body,
  })
  setShowOverlay(true)
  setShowRewardModal(true)
}
