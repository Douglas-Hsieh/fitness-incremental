import { List } from "immutable"
import { STEPS_REQUIRED_FOR_REWARD } from "../assets/data/Constants"
import { GameState } from "../assets/data/GameState";
import { dateToYYYYMMDDFormat, numberToHumanFormat } from "./math/formatting"

class Reward {
  title: string;
  body: string;

  constructor(title: string, body: string) {
    this.title = title
    this.body = body
  }
}

export class RewardNothing extends Reward {}

export class RewardInstantBonus extends Reward {
  bonus: number;

  constructor(title: string, body: string, bonus: number) {
    super(title, body)
    this.bonus = bonus
  }
}

export class RewardTemporaryMultiplier extends Reward {
  multiplier: number;
  expirationDate: Date;

  constructor(title: string, body: string, multiplier: number, expirationDate: Date) {
    super(title, body)
    this.multiplier = multiplier
    this.expirationDate = expirationDate
  }
}

export const generateRandomReward = (oneTickRevenue: number) => {
  const p = Math.random()

  if (p < 0.5) {
    return generateNothingReward()
  } else if (p < 0.75) {
    return generateInstantBonus(oneTickRevenue)
  } else {
    return generateTemporaryMultiplier()
  }
}

export const generateNothingReward = () => {
  return new RewardNothing(
    'Nothing',
    'Better luck next time...',
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

export const generateTemporaryMultiplier = () => {
  const multiplier = 3
  const now = new Date()
  const oneDayLater = new Date(now.getTime() + 86400000)

  return new RewardTemporaryMultiplier(
    'Temporary Multiplier',
    `You will produce x${multiplier} as much for 24 hours!`,
    multiplier,
    oneDayLater,
  )
}

export const isElligibleForStepsReward = (rewardTimes: List<Date>, stepsToday: number) => {
  const dates = rewardTimes.map(rewardTime => dateToYYYYMMDDFormat(rewardTime))
  const rewardTime = new Date()
  const rewardDate = dateToYYYYMMDDFormat(rewardTime)

  const isElligible = stepsToday >= STEPS_REQUIRED_FOR_REWARD
    && !dates.includes(rewardDate)

  return isElligible
}

export function giveReward(reward: RewardNothing | RewardInstantBonus | RewardTemporaryMultiplier, setGameState: React.Dispatch<React.SetStateAction<GameState>>) {
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
  }
}