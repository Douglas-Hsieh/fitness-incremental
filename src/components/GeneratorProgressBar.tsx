import React from "react"
import { Text } from "react-native"
import { Generator } from "../../assets/data/Generators"
import { GameState } from "../../assets/data/GameState"
import { numberToHumanFormat } from "../math/formatting"
import { calculateGeneratorProductivity, calculateGeneratorRevenue } from "../math/revenue"
import EStyleSheet from "react-native-extended-stylesheet"
import { IndeterminateProgress } from "./IndeterminateProgress"
import { DeterminateProgress } from "./DeterminateProgress"
import { calculateTicksToUse } from "../math/math"

interface GeneratorProgressBarProps {
  generator: Generator;
  gameState: GameState;
}

export const GeneratorProgressBar = ({generator, gameState}: GeneratorProgressBarProps) => {

  // Calculate progress
  const generatorState = gameState.generatorStateById.get(generator.id)!
  const progress = generatorState.ticks / generator.initialTicks

  const ticksToUse = calculateTicksToUse(gameState.ticks, gameState.speed)
  if (ticksToUse > generator.initialTicks) {
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