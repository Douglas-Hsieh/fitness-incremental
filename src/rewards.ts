import { List } from "immutable"
import { STEPS_REQUIRED_FOR_REWARD } from "../assets/data/Constants"
import { dateToYYYYMMDDFormat } from "./math/formatting"
import { TemporaryMultiplier } from "./types/TemporaryMultiplier"

export enum Reward {
  Nothing,
  InstantBonus,
  TemporaryMultiplier,
}

export const generateRandomReward = () => {
  const p = Math.random()

  if (p < 0.5) {
    return Reward.Nothing
  } else if (p < 0.75) {
    return Reward.InstantBonus
  } else {
    return Reward.TemporaryMultiplier
  }
}

export const generateInstantBonus = (oneTickRevenue: number) => {
  return 86400 * oneTickRevenue
}

export const generateTemporaryMultiplier = (): TemporaryMultiplier => {
  const now = new Date()
  const oneDayLater = new Date(now.getTime() + 86400000)

  return {
    multiplier: 3,
    expirationDate: oneDayLater
  }
}

export const isElligibleForStepsReward = (rewardTimes: List<Date>, stepsToday: number) => {
  const dates = rewardTimes.map(rewardTime => dateToYYYYMMDDFormat(rewardTime))
  const rewardTime = new Date()
  const rewardDate = dateToYYYYMMDDFormat(rewardTime)

  const isElligible = stepsToday >= STEPS_REQUIRED_FOR_REWARD
    && !dates.includes(rewardDate)

  return isElligible
}