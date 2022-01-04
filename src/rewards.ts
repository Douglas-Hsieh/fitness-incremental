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