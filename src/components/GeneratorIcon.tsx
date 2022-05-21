import React, { memo } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import colors from "../../assets/colors/colors";

interface AnimatedOverlayProps {
  low: number;
  high: number;
}

const AnimatedOverlay = ({low, high}: AnimatedOverlayProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withRepeat(
          withSequence(
            withTiming(high, {duration: 800, easing: Easing.linear}),
            withTiming(low , {duration: 800, easing: Easing.linear}),
            withTiming(high, {duration: 800, easing: Easing.linear}),
          ), -1
        )
    }
  })

  return (
    <Animated.View style={[
        styles.overlay,
        animatedStyle,
      ]}
    />
  )
}

interface GeneratorIconProps {
  image: any;
  ownsSome: boolean;
  isOperating: boolean;
}

export const GeneratorIcon = memo(({image, ownsSome, isOperating}: GeneratorIconProps) => {
  let low: number;
  let high: number;
  if (ownsSome && isOperating) {
    low = 0;
    high = 0;
  } else if (ownsSome && !isOperating) {
    low = .25
    high = .75
  } else {
    low = .75;
    high = .75
  }

  return (
    <>
      <View style={styles.iconContainer1}>
        <View style={styles.iconContainer2}>
          <View style={styles.iconContainer3}>
            <Image source={image} style={styles.icon}/>
          </View>
        </View>
      </View>
      
      { low === high &&
        <View style={[styles.overlay, {opacity: low}]}/>
      }
      { low != high &&
        <AnimatedOverlay low={low} high={high}/>
      }
      
    </>
)})

const ICON_HEIGHT = 90
const ICON_WIDTH = 90
const ICON_BORDER_RADIUS = 60

const styles = StyleSheet.create({
  iconContainer1: {
    height: ICON_HEIGHT,
    width: ICON_WIDTH,
    backgroundColor: colors.blue3,
    borderRadius: ICON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer2: {
    height: '90%',
    width: '90%',
    backgroundColor: colors.blue1,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer3: {
    height: '90%',
    width: '90%',
    backgroundColor: colors.blue2,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: '80%',
    width: '80%',
  },
  overlay: {
    position: 'absolute',
    height: ICON_HEIGHT,
    width: ICON_WIDTH,
    borderRadius: ICON_BORDER_RADIUS,
    backgroundColor: colors.black,
  },
})