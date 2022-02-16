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
}

export const GeneratorProgressBar = ({generator, gameState, ticksNeeded}: GeneratorProgressBarProps) => {

  // Calculate progress
  const generatorState = gameState.generatorStateById.get(generator.id)!
  const progress = generatorState.ticks / ticksNeeded

  const ticksToUse = calculateTicksToUse(gameState.ticks, gameState.speed)
  if (ticksToUse > ticksNeeded) {
    const productivity = calculateGeneratorProductivity(generator, gameState)
    const [coefficient, scale] = numberToHumanFormat(productivity)
    const text = `${coefficient} ${scale} / sec`
    return (
      <>
        <IndeterminateProgress/>
        <Text style={styles.text}>{text}</Text>
      </>
    )
  } else {
    const revenue = calculateGeneratorRevenue(generator, gameState)
    const [coefficient, scale] = numberToHumanFormat(revenue)
    const text = `${coefficient} ${scale}`
    return (
      <>
        <DeterminateProgress progress={progress}/>
        <Text style={styles.text}>{text}</Text>
      </>
    )
  }
}

const styles = EStyleSheet.create({
  animatedProgress: {
    flex: .75,
    width: '100%',
    borderRadius: 100,
    borderWidth: 1,
  },
  text: {
    position: 'absolute',
    alignSelf: 'center',
  },
})