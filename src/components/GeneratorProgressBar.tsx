import React from "react"
import { GestureResponderEvent, Text } from "react-native"
import { Generator } from "../../assets/data/Generators"
import { GameState } from "../../assets/data/GameState"
import { numberToHumanFormat } from "../math/formatting"
import { calculateGeneratorProductivity, calculateGeneratorRevenue } from "../math/revenue"
import EStyleSheet from "react-native-extended-stylesheet"
import { IndeterminateProgress } from "./IndeterminateProgress"
import { DeterminateProgress } from "./DeterminateProgress"
import { ProgressBarRef } from "./GeneratorComponent"

interface GeneratorProgressBarProps {
  generator: Generator;
  gameState: GameState;
  ticksNeeded: number;
  isGold: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | null;
}

export const GeneratorProgressBar = React.forwardRef<ProgressBarRef, GeneratorProgressBarProps>(({generator, gameState, ticksNeeded, isGold, onPress}, ref) => {

  // Calculate progress
  const generatorState = gameState.generatorStateById.get(generator.id)!
  const progress = generatorState.ticks / ticksNeeded

  if (!generatorState.hasManager) {
    const revenue = calculateGeneratorRevenue(generator, gameState)
    const [coefficient, scale] = numberToHumanFormat(revenue)
    const text = `${coefficient} ${scale}`
    return (
      <>
        <DeterminateProgress ref={ref} progress={progress} isGold={isGold} onPress={onPress}/>
        <Text style={styles.text}>{text}</Text>
      </>
    )
  } else {
    const productivity = calculateGeneratorProductivity(generator, gameState)
    const [coefficient, scale] = numberToHumanFormat(productivity)
    const text = `${coefficient} ${scale} / sec`
    return (
      <>
        <IndeterminateProgress isGold={isGold} onPress={onPress}/>
        <Text style={styles.text}>{text}</Text>
      </>
    )
  }
})

const styles = EStyleSheet.create({
  text: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: '.9rem',
  },
})