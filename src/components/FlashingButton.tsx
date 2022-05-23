import React from "react"
import Animated, { Easing, useAnimatedStyle, withRepeat, withSequence, withTiming } from "react-native-reanimated"
import { Button, ButtonProps } from "./Button"

export const FlashingButton = (props: ButtonProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withRepeat(
          withSequence(
            withTiming(1, {duration: 500, easing: Easing.linear}),
            withTiming(.5 , {duration: 500, easing: Easing.linear}),
            withTiming(1, {duration: 500, easing: Easing.linear}),
          ), -1
        )
    }
  })

  return (
    <Animated.View style={animatedStyle}>
      <Button {...props}/>
    </Animated.View>
  )
}