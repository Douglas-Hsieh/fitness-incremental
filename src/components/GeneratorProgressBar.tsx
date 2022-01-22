import React from "react"
import { StyleSheet, Text } from "react-native"
import AnimatedProgress from "react-native-reanimated-progress-bar"
import colors from "../../assets/colors/colors"
import { Generator } from "../../assets/data/Generators"
import { GameState } from "../../assets/data/GameState"
import { numberToHumanFormat } from "../math/formatting"
import { calculateGeneratorRevenue } from "../math/revenue"

interface GeneratorProgressBarProps {
  generator: Generator;
  gameState: GameState;
}

export const GeneratorProgressBar = ({generator, gameState}: GeneratorProgressBarProps) => {
  // console.log('GeneratorProgressBar render')

  // Calculate progress
  const generatorState = gameState.generatorStateById.get(generator.id)!
  const progress = generatorState.ticks / generator.initialTicks
  const revenue = calculateGeneratorRevenue(generator, gameState)
  const [coefficient, scale] = numberToHumanFormat(revenue)
  const text = `${coefficient} ${scale}`

  return (
    <>
      <AnimatedProgress
        fill={colors.green3}
        current={progress}
        total={1}
        style={styles.animatedProgress}
      />
      <Text style={styles.text}>{text}</Text>
    </>
  )
}

const styles = StyleSheet.create({
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