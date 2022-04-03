import { LocationObject } from "expo-location"
import React, { useState, useEffect } from "react"
import { GameState } from "../../assets/data/GameState"
import { GENERATORS } from "../../assets/data/Generators"
import { calculateOneTickBaseRevenue } from "../math/revenue"
import { generateRandomReward, RewardInstantBonus, RewardTemporaryMultiplier } from "../rewards"
import RewardModalDetails from "../types/RewardModalDetails"
import { Overlay } from "./Overlay"
import { RewardModal } from "./RewardModal"
import { canReceiveWorkoutReward } from "../math/workout-reward"

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

  useEffect(() => {
    if (!fitnessLocation || !currentLocation) {
      return
    }
    const now = new Date()
    if (!canReceiveWorkoutReward(fitnessLocation, currentLocation, gameState.lastWorkoutRewardTime, now)) {
      return
    }

    const oneTickBaseRevenue = calculateOneTickBaseRevenue(GENERATORS, gameState)
    const reward = generateRandomReward(oneTickBaseRevenue)
    const { title, body } = reward

    setGameState(prevGameState => ({
      ...prevGameState,
      lastWorkoutRewardTime: now,
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
      title: `Workout Reward: ${title}`,
      body: body,
    })
    setShowOverlay(true)
    setShowRewardModal(true)

  }, [fitnessLocation, currentLocation])

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