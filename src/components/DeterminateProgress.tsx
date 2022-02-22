import { Rect } from 'react-native-svg'
import colors from "../../assets/colors/colors";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';

const AnimatedRect = Animated.createAnimatedComponent(Rect)

interface DeterminateProgressProps {
  progress: number;
  isGold: boolean;
}

export const DeterminateProgress = ({progress, isGold}: DeterminateProgressProps) => {

  const [colorUsed, setColorUsed] = useState<string>(colors.green3)
  const [startX, setStartX] = useState<number>(-200)
  const endX = 0

  const translateX = useSharedValue(startX)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
      ],
      backgroundColor: colorUsed,
    }
  })

  const prevProgress = useRef({ progress }).current

  useEffect(() => {
    if (progress < prevProgress.progress) {
      translateX.value = withSequence(
        withTiming(endX, { duration: 250, easing: Easing.linear}),
        withTiming(startX, { duration: 0 }),
        withTiming(startX * (1 - progress), { duration: 250 })
      )
    } else {
      translateX.value = withTiming(startX * (1 - progress), { duration: 500, easing: Easing.linear })
    }
    prevProgress.progress = progress
  }, [progress])

  useEffect(() => {
    if (isGold) {
      setColorUsed(colors.gold)
    } else {
      setColorUsed(colors.green3)
    }
  }, [isGold])

  const onLayout = (event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    setStartX(-width)
  }

  return (
    <>
      <View style={styles.bar} onLayout={onLayout}>
        <Animated.View style={[styles.svgContainer, animatedStyle]}>
          <AnimatedRect height={'100%'} width={'100%'} fill={'green'}/>
        </Animated.View>
      </View>
    </>

  )
}

const styles = StyleSheet.create({
  bar: {
    flex: .75,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 100,
    borderWidth: 1,
    backgroundColor: colors.white,
  },
  svgContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: '100%',
  }
})