import { Rect } from 'react-native-svg'
import colors from "../../assets/colors/colors";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { useEffect, useRef, useState } from 'react';
import { GestureResponderEvent, LayoutChangeEvent, Pressable, StyleSheet } from 'react-native';
import { window } from '../util/Window';

const AnimatedRect = Animated.createAnimatedComponent(Rect)

interface DeterminateProgressProps {
  progress: number;
  isGold?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | null;
}

export const DeterminateProgress = ({progress, isGold, onPress}: DeterminateProgressProps) => {

  const [colorUsed, setColorUsed] = useState<string>(colors.green3)
  const [startX, setStartX] = useState<number>(-window.width)
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
  }, [progress, startX])

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
      <Pressable style={styles.bar} onLayout={onLayout} onPress={onPress}>
        <Animated.View style={[styles.svgContainer, animatedStyle]}>
          <AnimatedRect height={'100%'} width={'100%'} fill={'green'}/>
        </Animated.View>
      </Pressable>
    </>

  )
}

const styles = StyleSheet.create({
  bar: {
    flex: .75,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 100,
    borderWidth: 1.5,
    backgroundColor: colors.gray2,
  },
  svgContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  }
})