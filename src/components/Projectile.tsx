import { useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { StepsImage } from "./TopBar"

interface ProjectileProps {
  x0: number;
  y0: number;
  image: JSX.Element
}

export const Projectile = ({x0, y0, image}: ProjectileProps) => {
  const [direction] = useState<number>(Math.random() > 0.5 ? 1 : -1)
  const [v0] = useState<number>(direction * (Math.random() * 20))
  const [θ0] = useState<number>((-direction * Math.random() * -Math.PI / 2))

  const [rotateZ] = useState<number>(Math.random() * 360)

  const time = useSharedValue(0)
  const endTime = 10
  const g = 9.81

  const animatedStyle = useAnimatedStyle(() => {
    const t = time.value;
    const x = v0 * Math.cos(θ0) * t
    const y = (v0 * Math.sin(θ0) * t)
      - ((1/2) * g * Math.pow(t, 2))
    const opacity = endTime - t

    return {
      left: x0 + x,
      top: y0 + y,
      transform: [{ rotateZ: `${rotateZ}deg` }],
      opacity: opacity,
    };
  })

  useEffect(() => {
    time.value = 0
    time.value = withTiming(endTime, {duration: 100 * endTime,easing: Easing.linear})
  }, [])

  return (
    <Animated.View style={[styles.projectile, animatedStyle]}>
      {image}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  projectile: {
    position: 'absolute',
  }
})