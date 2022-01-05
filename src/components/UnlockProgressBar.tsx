import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../../assets/colors/colors";
import { CurrencyGenerator } from "../../assets/data/CurrencyGenerators";
import { GeneratorState } from "../../assets/data/GameState";
import { getLastUnlock, getNextUnlock } from "../../assets/data/GeneratorUnlocks";

interface UnlockProgressBarProps {
  generator: CurrencyGenerator;
  generatorState: GeneratorState;
}

export const UnlockProgressBar = ({generator, generatorState}: UnlockProgressBarProps) => {

  let progress
  const lastUnlock = getLastUnlock(generator.id, generatorState.owned)
  const nextUnlock = getNextUnlock(generator.id, generatorState.owned)
  if (!lastUnlock && nextUnlock) {
    progress = generatorState.owned / nextUnlock.count
  } else if (lastUnlock && nextUnlock) {
    progress = (generatorState.owned - lastUnlock.count) / (nextUnlock.count - lastUnlock.count)
  } else {
    progress = 1
  }

  let text
  if (nextUnlock) {
    text = `${generatorState.owned}/${nextUnlock.count}`
  } else {
    text = generatorState.owned
  }

  return (
    <View style={styles.container}>
      <View style={[
        styles.progressBar,
        {width: progress * styles.progressBar.width},
      ]}/>
      <Text style={styles.text}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: -20,

    width: 90,
    height: 25,
    backgroundColor: colors.blue3,
    borderRadius: 20,
    alignItems: 'center',
  },
  progressBar: {
    marginTop: 2.5,
    width: 85,
    height: 20,
    backgroundColor: colors.green2,
    borderRadius: 19,
  },
  text: {
    marginTop: -20,
    color: colors.white,
    textShadowColor: colors.black,
    textShadowRadius: 5,
  },
})