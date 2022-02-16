import React, { useState, useEffect } from "react"
import { GameState, INITIAL_STEPS_UNTIL_NEXT_RANDOM_REWARD } from "../../assets/data/GameState"
import { GENERATORS } from "../../assets/data/Generators"
import { numberToHumanFormat } from "../math/formatting"
import { calculateOneTickBaseRevenue } from "../math/revenue"
import { generateRandomReward, Reward, generateInstantBonus, generateTemporaryMultiplier } from "../rewards"
import RewardModalDetails from "../types/RewardModalDetails"
import { Overlay } from "./Overlay"
import { RewardModal } from "./RewardModal"

interface StepRewardProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const StepReward = ({gameState, setGameState}: StepRewardProps) => {
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
      setGameState(prevGameState => ({
        ...prevGameState,
        stepsUntilNextRandomReward: INITIAL_STEPS_UNTIL_NEXT_RANDOM_REWARD,
      }))
      title = 'Nothing :('
      body = 'Better luck next time...'

    } else if (reward === Reward.InstantBonus) {
      const oneTickBaseRevenue = calculateOneTickBaseRevenue(GENERATORS, gameState)
      const bonus = generateInstantBonus(oneTickBaseRevenue)
      const [coefficient, scale] = numberToHumanFormat(bonus)
      setGameState(prevGameState => ({
        ...prevGameState,
        stepsUntilNextRandomReward: INITIAL_STEPS_UNTIL_NEXT_RANDOM_REWARD,
        balance: gameState.balance + bonus,
        sessionEarnings: gameState.sessionEarnings + bonus,
      }))
      title = 'Instant Bonus'
      body = `You just gained ${coefficient} ${scale} steps!`

    } else {
      const temporaryMultiplier = generateTemporaryMultiplier()
      setGameState(prevGameState => ({
        ...prevGameState,
        stepsUntilNextRandomReward: INITIAL_STEPS_UNTIL_NEXT_RANDOM_REWARD,
        temporaryMultipliers: gameState.temporaryMultipliers.add(temporaryMultiplier),
      }))
      title = 'Temporary Multiplier'
      body = `You will produce x${temporaryMultiplier.multiplier} as much for 24 hours!`
    }

    setRewardModalDetails({
      reward: reward,
      title: `5000 Steps Reward: ${title}`,
      body: body,
    })
    setShowOverlay(true)
    setShowRewardModal(true)

  }, [gameState.stepsUntilNextRandomReward])

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