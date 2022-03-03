import React, { useState, useEffect } from "react"
import { STEPS_REQUIRED_FOR_REWARD } from "../../assets/data/Constants"
import { GameState } from "../../assets/data/GameState"
import { GENERATORS } from "../../assets/data/Generators"
import { numberToHumanFormat } from "../math/formatting"
import { calculateOneTickBaseRevenue } from "../math/revenue"
import { generateRandomReward, Reward, generateInstantBonus, generateTemporaryMultiplier, isElligibleForStepsReward } from "../rewards"
import RewardModalDetails from "../types/RewardModalDetails"
import { Overlay } from "./Overlay"
import { RewardModal } from "./RewardModal"

interface StepsRewardProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  stepsToday: number;
}

export const StepsReward = ({gameState, setGameState, stepsToday}: StepsRewardProps) => {
  const [showOverlay, setShowOverlay] = useState<boolean>(false)
  const [rewardModalDetails, setRewardModalDetails] = useState<RewardModalDetails>()
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false)

  useEffect(() => {
    if (!isElligibleForStepsReward(gameState.stepsRewardTimes, stepsToday)) {
      return
    }

    const reward = generateRandomReward()
    const rewardTime = new Date()

    let title: string, body: string

    if (reward === Reward.Nothing) {
      setGameState(prevGameState => ({
        ...prevGameState,
        stepsRewardTimes: prevGameState.stepsRewardTimes.push(rewardTime),
      }))
      title = 'Nothing :('
      body = 'Better luck next time...'

    } else if (reward === Reward.InstantBonus) {
      const oneTickBaseRevenue = calculateOneTickBaseRevenue(GENERATORS, gameState)
      const bonus = generateInstantBonus(oneTickBaseRevenue)
      const [coefficient, scale] = numberToHumanFormat(bonus)
      setGameState(prevGameState => ({
        ...prevGameState,
        stepsRewardTimes: prevGameState.stepsRewardTimes.push(rewardTime),
        balance: prevGameState.balance + bonus,
        sessionEarnings: prevGameState.sessionEarnings + bonus,
      }))
      title = 'Instant Bonus'
      body = `You just gained ${coefficient} ${scale} steps!`

    } else {
      const temporaryMultiplier = generateTemporaryMultiplier()
      setGameState(prevGameState => ({
        ...prevGameState,
        stepsRewardTimes: prevGameState.stepsRewardTimes.push(rewardTime),
        temporaryMultipliers: prevGameState.temporaryMultipliers.add(temporaryMultiplier),
      }))
      title = 'Temporary Multiplier'
      body = `You will produce x${temporaryMultiplier.multiplier} as much for 24 hours!`
    }

    setRewardModalDetails({
      reward: reward,
      title: `${STEPS_REQUIRED_FOR_REWARD} Steps Reward: ${title}`,
      body: body,
    })
    setShowOverlay(true)
    setShowRewardModal(true)

  }, [stepsToday])

  const handleCloseRewardModal = () => {
    setTimeout(() => {setShowRewardModal(false), 5000})
    setShowOverlay(false)
  }

  return (
    <>
      { rewardModalDetails && showOverlay && <Overlay/>}
      { rewardModalDetails && showRewardModal && <RewardModal details={rewardModalDetails} onClose={handleCloseRewardModal}/>}
    </>
  )
}