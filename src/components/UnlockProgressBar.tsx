import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import colors from "../../assets/colors/colors";
import { Generator } from "../../assets/data/Generators";
import { getLastUnlock, getNextUnlock } from "../../assets/data/GeneratorUnlocks";
import { ProgressBar } from "./ProgressBar";

interface UnlockProgressBarProps {
  generator: Generator;
  owned: number;
}

export const UnlockProgressBar = memo(({generator, owned}: UnlockProgressBarProps) => {

  let progress
  const lastUnlock = getLastUnlock(generator.id, owned)
  const nextUnlock = getNextUnlock(generator.id, owned)
  if (!lastUnlock && nextUnlock) {
    progress = owned / nextUnlock.count
  } else if (lastUnlock && nextUnlock) {
    progress = (owned - lastUnlock.count) / (nextUnlock.count - lastUnlock.count)
  } else {
    progress = 1
  }

  let text
  if (nextUnlock) {
    text = `${owned}/${nextUnlock.count}`
  } else {
    text = owned.toString()
  }

  return (
    <View style={styles.container}>
      <ProgressBar
        progress={progress}
        text={text}
        progressBarBackgroundClassnames={'bg-blue-900'}
        textClassnames={'text-white'}
        textStyle={styles.dropShadow}
      />
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: -15,
  },
  dropShadow: {
    textShadowColor: colors.black,
    textShadowRadius: 5,
  },
})