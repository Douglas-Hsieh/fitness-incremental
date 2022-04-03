import React, { useState, useEffect } from "react"
import { STEPS_REQUIRED_FOR_REWARD } from "../../assets/data/Constants"
import { GameState } from "../../assets/data/GameState"
import { GENERATORS } from "../../assets/data/Generators"
import { calculateOneTickBaseRevenue } from "../math/revenue"
import { generateRandomReward, isElligibleForStepsReward, RewardNothing, RewardInstantBonus, RewardTemporaryMultiplier } from "../rewards"
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
    const oneTickBaseRevenue = calculateOneTickBaseRevenue(GENERATORS, gameState)
    const reward = generateRandomReward(oneTickBaseRevenue)
    const rewardTime = new Date()
    const { title, body } = reward

    setGameState(prevGameState => ({
      ...prevGameState,
      stepsRewardTimes: prevGameState.stepsRewardTimes.push(rewardTime),
    }))

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