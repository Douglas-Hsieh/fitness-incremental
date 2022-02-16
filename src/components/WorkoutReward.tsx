import { LocationObject } from "expo-location"
import React, { useState, useEffect } from "react"
import { GameState } from "../../assets/data/GameState"
import { GENERATORS } from "../../assets/data/Generators"
import { numberToHumanFormat } from "../math/formatting"
import { calculateOneTickBaseRevenue } from "../math/revenue"
import { generateRandomReward, Reward, generateInstantBonus, generateTemporaryMultiplier } from "../rewards"
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

    if (canReceiveWorkoutReward(fitnessLocation, currentLocation, gameState.lastWorkoutRewardTime, now)) {
      const reward = generateRandomReward()
      let title: string, body: string
  
      if (reward === Reward.Nothing) {
        setGameState(prevGameState => ({
          ...prevGameState,
          lastWorkoutRewardTime: now,
        }))
        title = 'Nothing :('
        body = 'Better luck next time...'
  
      } else if (reward === Reward.InstantBonus) {
        const oneTickBaseRevenue = calculateOneTickBaseRevenue(GENERATORS, gameState)
        const bonus = generateInstantBonus(oneTickBaseRevenue)
        const [coefficient, scale] = numberToHumanFormat(bonus)
        setGameState(prevGameState => ({
          ...prevGameState,
          lastWorkoutRewardTime: now,
          balance: gameState.balance + bonus,
          lifetimeEarningsSinceBeginning: gameState.lifetimeEarningsSinceBeginning + bonus,
        }))
        title = 'Instant Bonus'
        body = `You just gained ${coefficient} ${scale} steps!`
  
      } else {
        const temporaryMultiplier = generateTemporaryMultiplier()
        setGameState(prevGameState => ({
          ...prevGameState,
          lastWorkoutRewardTime: now,
          temporaryMultipliers: gameState.temporaryMultipliers.add(temporaryMultiplier),
        }))
        title = 'Temporary Multiplier'
        body = `You will produce x${temporaryMultiplier.multiplier} as much for 24 hours!`
      }
  
      setRewardModalDetails({
        reward: reward,
        title: `Workout Reward: ${title}`,
        body: body,
      })
      setShowOverlay(true)
      setShowRewardModal(true)
    }

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