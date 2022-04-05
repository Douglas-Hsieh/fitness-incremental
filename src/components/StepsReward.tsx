import React, { useState, useEffect } from "react"
import { GameState } from "../../assets/data/GameState"
import { GENERATORS } from "../../assets/data/Generators"
import { dateToYYYYMMDDFormat } from "../math/formatting"
import { calculateOneTickBaseRevenue } from "../math/revenue"
import { generateReward, giveReward, displayReward, calculateStepRewardsLeft } from "../rewards"
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
    if (showRewardModal) {
      return
    }

    const today = dateToYYYYMMDDFormat(new Date())
    const fitnessRewards = gameState.fitnessRewardsByDate.get(today)
    if (!fitnessRewards) return

    const rewardsLeft = calculateStepRewardsLeft(fitnessRewards.steps, fitnessRewards.stepRewards)
    if (rewardsLeft <= 0) {
      return
    }

    const oneTickBaseRevenue = calculateOneTickBaseRevenue(GENERATORS, gameState)
    const reward = generateReward(oneTickBaseRevenue)
    const { title, body } = reward

    setGameState(prevGameState => ({
      ...prevGameState,
      fitnessRewardsByDate: prevGameState.fitnessRewardsByDate.set(
        today,
        fitnessRewards.set("stepRewards", fitnessRewards.get("stepRewards") + 1)
      )
    }))
    giveReward(reward, setGameState)
    displayReward(setRewardModalDetails, reward, `Steps Reward: ${title}`, body, setShowOverlay, setShowRewardModal)
  }, [stepsToday, showRewardModal])

  const handleCloseRewardModal = () => {
    setShowRewardModal(false)
    setRewardModalDetails(undefined)
    setShowOverlay(false)
  }

  return (
    <>
      { rewardModalDetails && showOverlay && <Overlay/>}
      { rewardModalDetails && showRewardModal && <RewardModal details={rewardModalDetails} onClose={handleCloseRewardModal}/>}
    </>
  )
}