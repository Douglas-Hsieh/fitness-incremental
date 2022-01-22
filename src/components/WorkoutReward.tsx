import { LocationObject } from "expo-location"
import React, { useState, useEffect } from "react"
import { GameState, INITIAL_STEPS_UNTIL_NEXT_RANDOM_REWARD } from "../../assets/data/GameState"
import { GENERATORS } from "../../assets/data/Generators"
import { calculateOneTickBaseRevenue, numberToHumanFormat } from "../math"
import { generateRandomReward, Reward, generateInstantBonus, generateTemporaryMultiplier } from "../rewards"
import RewardModalDetails from "../types/RewardModalDetails"
import { Overlay } from "./Overlay"
import { RewardModal } from "./RewardModal"
import haversine from 'haversine';

interface WorkoutReward {
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
  currentLocation: LocationObject | undefined;
}

export const WorkoutReward = ({gameState, setGameState, currentLocation}: WorkoutReward) => {
  const { fitnessLocation } = gameState
  const [showOverlay, setShowOverlay] = useState<boolean>(false)
  const [rewardModalDetails, setRewardModalDetails] = useState<RewardModalDetails>()
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false)

  useEffect(() => {
    if (gameState.stepsUntilNextRandomReward > 0) {
      return
    }

    const reward = generateRandomReward()
    let title: string, body: string

    if (reward === Reward.Nothing) {
      setGameState({
        ...gameState,
        stepsUntilNextRandomReward: INITIAL_STEPS_UNTIL_NEXT_RANDOM_REWARD,
      })
      title = 'Nothing :('
      body = 'Better luck next time...'

    } else if (reward === Reward.InstantBonus) {
      const oneTickBaseRevenue = calculateOneTickBaseRevenue(GENERATORS, gameState)
      const bonus = generateInstantBonus(oneTickBaseRevenue)
      const [coefficient, scale] = numberToHumanFormat(bonus)
      setGameState({
        ...gameState,
        stepsUntilNextRandomReward: INITIAL_STEPS_UNTIL_NEXT_RANDOM_REWARD,
        balance: gameState.balance + bonus,
        lifetimeEarnings: gameState.lifetimeEarnings + bonus,
      })
      title = 'Instant Bonus'
      body = `You just gained ${coefficient} ${scale} steps!`

    } else {
      const temporaryMultiplier = generateTemporaryMultiplier()
      setGameState({
        ...gameState,
        stepsUntilNextRandomReward: INITIAL_STEPS_UNTIL_NEXT_RANDOM_REWARD,
        temporaryMultipliers: gameState.temporaryMultipliers.add(temporaryMultiplier),
      })
      title = 'Temporary Multiplier'
      body = `You will produce x${temporaryMultiplier.multiplier} as much for 24 hours!`
    }

    setRewardModalDetails({
      reward: reward,
      title: title,
      body: body,
    })
    setShowOverlay(true)
    setShowRewardModal(true)

  }, [gameState.stepsUntilNextRandomReward])

  useEffect(() => {
    if (!fitnessLocation || !currentLocation) {
      return
    }

    const fitnessLocationLatLng = {
      longitude: fitnessLocation.coordinates[0],
      latitude: fitnessLocation.coordinates[1],
    }
    const isNearFitnessLocation = haversine(fitnessLocationLatLng, currentLocation.coords, { unit: 'mile', threshold: 0.1})

    const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - gameState.lastWorkoutRewardTime.getTime())

    if (fitnessLocation.isVerified && isNearFitnessLocation && diffTime > EIGHT_HOURS_MS) {
      const reward = generateRandomReward()
      let title: string, body: string
  
      if (reward === Reward.Nothing) {
        setGameState({
          ...gameState,
          lastWorkoutRewardTime: now,
        })
        title = 'Nothing :('
        body = 'Better luck next time...'
  
      } else if (reward === Reward.InstantBonus) {
        const oneTickBaseRevenue = calculateOneTickBaseRevenue(GENERATORS, gameState)
        const bonus = generateInstantBonus(oneTickBaseRevenue)
        const [coefficient, scale] = numberToHumanFormat(bonus)
        setGameState({
          ...gameState,
          lastWorkoutRewardTime: now,
          balance: gameState.balance + bonus,
          lifetimeEarnings: gameState.lifetimeEarnings + bonus,
        })
        title = 'Instant Bonus'
        body = `You just gained ${coefficient} ${scale} steps!`
  
      } else {
        const temporaryMultiplier = generateTemporaryMultiplier()
        setGameState({
          ...gameState,
          lastWorkoutRewardTime: now,
          temporaryMultipliers: gameState.temporaryMultipliers.add(temporaryMultiplier),
        })
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