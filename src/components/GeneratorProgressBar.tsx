import React from "react"
import { Text } from "react-native"
import { Generator } from "../../assets/data/Generators"
import { GameState } from "../../assets/data/GameState"
import { numberToHumanFormat } from "../math/formatting"
import { calculateGeneratorProductivity, calculateGeneratorRevenue, calculateTicksToUse } from "../math/revenue"
import EStyleSheet from "react-native-extended-stylesheet"
import { IndeterminateProgress } from "./IndeterminateProgress"
import { DeterminateProgress } from "./DeterminateProgress"

interface GeneratorProgressBarProps {
  generator: Generator;
  gameState: GameState;
  ticksNeeded: number;
  isGold: boolean;
}

export const GeneratorProgressBar = ({generator, gameState, ticksNeeded, isGold}: GeneratorProgressBarProps) => {

  // Calculate progress
  const generatorState = gameState.generatorStateById.get(generator.id)!
  const progress = generatorState.ticks / ticksNeeded

  const ticksToUse = calculateTicksToUse(gameState.ticks, gameState.speed)
  if (ticksToUse <= ticksNeeded || (!generatorState.hasManager && !generatorState.isManuallyOperating)) {
    const revenue = calculateGeneratorRevenue(generator, gameState)
    const [coefficient, scale] = numberToHumanFormat(revenue)
    const text = `${coefficient} ${scale}`
    return (
      <>
        <DeterminateProgress progress={progress} isGold={isGold}/>
        <Text style={styles.text}>{text}</Text>
      </>
    )
  } else {
    const productivity = calculateGeneratorProductivity(generator, gameState)
    const [coefficient, scale] = numberToHumanFormat(productivity)
    const text = `${coefficient} ${scale} / sec`
    return (
      <>
        <IndeterminateProgress isGold={isGold}/>
        <Text style={styles.text}>{text}</Text>
      </>
    )
  }
}

const styles = EStyleSheet.create({
  text: {
    position: 'absolute',
    alignSelf: 'center',
  },
})