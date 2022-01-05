// Requires tailwind

import React, { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import tailwind from 'tailwind-rn'
import colors from '../../assets/colors/colors'

interface ProgressBarProps {
  progress: number;
  text: string;
}

export const ProgressBar: FC<ProgressBarProps> = ({progress, text}) => {

  const progressPercent = `${progress * 100}%`

  return (
    <View style={tailwind('h-6 w-full max-w-xl rounded-full overflow-hidden border')}>
      <View style={tailwind('w-full h-full bg-blue-900 absolute')}/>
      <View style={[tailwind('h-full bg-green-400 absolute'), {width: progressPercent}]}/>
      <View style={tailwind('w-full h-full items-center justify-center')}>
        <Text style={[tailwind('text-white'), styles.dropShadow]}>{text}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  dropShadow: {
    textShadowColor: colors.black,
    textShadowRadius: 5,
  }
})