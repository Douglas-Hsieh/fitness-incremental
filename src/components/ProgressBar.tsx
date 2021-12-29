// Requires tailwind

import React from 'react'
import { Text, View } from 'react-native'
// import { tailwind } from '../tailwind'
import tailwind from 'tailwind-rn'

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar = ({progress}: ProgressBarProps) => {

  const progressPercent = `${progress * 100}%`

  return (
    <View style={tailwind('h-9 max-w-xl rounded-full overflow-hidden border')}>
      <View style={tailwind('w-full h-full bg-gray-200 absolute')}/>
      <View style={[tailwind('h-full bg-green-500 absolute'), {width: progressPercent}]}/>
      <View style={tailwind('w-full h-full items-center justify-center')}>
        <Text style={tailwind('')}>Text</Text>
      </View>
    </View>
  )
}