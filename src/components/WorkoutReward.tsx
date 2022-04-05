import { LocationObject } from "expo-location"
import React, { useState, useEffect } from "react"
import { GameState } from "../../assets/data/GameState"
import { GENERATORS } from "../../assets/data/Generators"
import { calculateOneTickBaseRevenue } from "../math/revenue"
import { canReceiveWorkoutReward, displayReward, generateReward, giveReward } from "../rewards"
import RewardModalDetails from "../types/RewardModalDetails"
import { Overlay } from "./Overlay"
import { RewardModal } from "./RewardModal"

interface WorkoutReward {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  currentLocation: LocationObject | undefined;
}

export const WorkoutReward = ({gameState, setGameState, currentLocation}: WorkoutReward) => {
  const { fitnessLocation } = gameState
  const [showOverlay, setShowOverlay] = useState<boolean>(false)
  const [rewardModalDetails, setRewardModalDetails] = useState<RewardModalDetails>()
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false)
  const [rewardsLeft, setRewardsLeft] = useState<number>(0)

  useEffect(() => {
    if (!fitnessLocation || !currentLocation) {
      return
    }
    const now = new Date()
    if (!canReceiveWorkoutReward(fitnessLocation, currentLocation, gameState.lastWorkoutRewardTime, now)) {
      return
    }

    setRewardsLeft(2)
    setGameState(prevGameState => ({
      ...prevGameState,
      lastWorkoutRewardTime: now,
    }))
  }, [fitnessLocation, currentLocation])

  useEffect(() => {
    if (rewardsLeft <= 0) {
      return
    }
    if (showRewardModal) {
      return
    }

    const oneTickBaseRevenue = calculateOneTickBaseRevenue(GENERATORS, gameState)
    const reward = generateReward(oneTickBaseRevenue)
    const { title, body } = reward

    giveReward(reward, setGameState)
    displayReward(setRewardModalDetails, reward, `Workout Reward: ${title}`, body, setShowOverlay, setShowRewardModal)

    setRewardsLeft(rewardsLeft - 1)
  }, [rewardsLeft, showRewardModal])

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