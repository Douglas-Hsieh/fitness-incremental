import Svg, { Defs, Rect, LinearGradient, Stop } from 'react-native-svg'
import colors from "../../assets/colors/colors";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const AnimatedRect = Animated.createAnimatedComponent(Rect)

interface IndeterminateProgressProps {
  isGold: boolean;
}

export const IndeterminateProgress = ({ isGold }: IndeterminateProgressProps) => {
  const [colorsUsed, setColorsUsed] = useState<string[]>([colors.green3, colors.green1])

  const startX = -200
  const endX = 0

  const translateX = useSharedValue(startX)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
      ]
    }
  })

  const translateBar = () => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(endX, {duration: 1000, easing: Easing.linear}),
        withTiming(startX, {duration: 0})
      ), -1
    )
  }

  useEffect(() => {
    translateBar()
  }, [])

  useEffect(() => {
    if (isGold) {
      setColorsUsed([colors.gold, colors.lightgoldenrodyellow])
    } else {
      setColorsUsed([colors.green3, colors.green1])
    }
  }, [isGold])

  return (
    <>
      <View style={styles.bar}>
        <Animated.View style={[styles.svgContainer, animatedStyle]}>
          <Svg>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={colorsUsed[0]} stopOpacity="1" />
                <Stop offset="0.25" stopColor={colorsUsed[1]} stopOpacity="1" />
                <Stop offset="0.5" stopColor={colorsUsed[0]} stopOpacity="1" />
                <Stop offset="0.75" stopColor={colorsUsed[1]} stopOpacity="1" />
                <Stop offset="1" stopColor={colorsUsed[0]} stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <AnimatedRect height={'100%'} width={'100%'} fill="url(#grad)"/>
          </Svg>
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
    borderWidth: 1.5,
  },
  svgContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: '210%',
  }
})