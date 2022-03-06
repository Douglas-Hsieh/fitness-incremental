// Requires tailwind

import React, { FC } from 'react'
import { Text, View } from 'react-native'
import tailwind from 'tailwind-rn'

interface ProgressBarProps {
  progress: number;
  text: string;
  containerClassnames?: string;
  progressBarBackgroundClassnames?: string;
  progressBarClassnames? : string;
  textClassnames?: string;
  textStyle?: any;
}

export const ProgressBar: FC<ProgressBarProps> = ({
  progress,
  text,
  containerClassnames,
  progressBarBackgroundClassnames,
  progressBarClassnames,
  textClassnames,
  textStyle,
}) => {

  const progressPercent = `${progress * 100}%`

  const containerClass = [
    'h-6 w-full max-w-xl rounded-full overflow-hidden border',
    containerClassnames,
  ].join(' ')
  const progressBarBackgroundClass = [
    'w-full h-full bg-white absolute',
    progressBarBackgroundClassnames,
  ].join(' ')
  const progressBarClass = [
    'h-full bg-green-400 absolute',
    progressBarClassnames,
  ].join(' ')
  const textClass = [
    'text-black',
    textClassnames,
  ].join(' ')

  return (
    <View style={tailwind(containerClass)}>
      <View style={tailwind(progressBarBackgroundClass)}/>
      <View style={[tailwind(progressBarClass), {width: progressPercent}]}/>
      <View style={tailwind('w-full h-full items-center justify-center')}>
        <Text style={[tailwind(textClass), textStyle]}>{text}</Text>
      </View>
    </View>
  )
}