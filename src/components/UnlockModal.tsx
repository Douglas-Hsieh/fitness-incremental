import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import colors from '../../assets/colors/colors';
import { GENERATORS_BY_ID } from '../../assets/data/Generators';
import { GeneratorUnlock } from '../../assets/data/GeneratorUnlocks';
import { playSound, SoundFile } from '../util/sounds';

interface UnlockModalProps {
  unlock: GeneratorUnlock;
}

export const UnlockModal = ({unlock}: UnlockModalProps) => {
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(opacity.value),
      transform: [{ scale: withSpring(scale.value)}]
    }
  })

  const showModal = (show: boolean) => {
    if (show) {
      opacity.value = 1
      scale.value = 1
    } else {
      opacity.value = 0
      scale.value = 0
    }
  }

  useEffect(() => {
    playSound(SoundFile.CashRegister)
    showModal(true)

    setTimeout(() => {
      showModal(false)
    }, 5000)
  }, [])

  let title, body, image
  if (unlock.targetGeneratorId === '0') {
    title = 'Everyone'
    image = require('../../assets/images/everyone.png')
  } else {
    const generator = GENERATORS_BY_ID.get(unlock.targetGeneratorId)!
    title = generator.name
    image = generator.image
  }
  body = `x${unlock.multiplier}`


  return (
    <View>
      <Animated.View
        style={[styles.modal, animatedStyle]}
      >
        <TouchableOpacity style={styles.touchable} onPress={() => showModal(false)}>
          <Image source={image} style={styles.icon}/>
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.bodyText}>{body}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>

  );
}

const modalWidth = 175
const modalHeight = 50

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    width: modalWidth,
    height: modalHeight,
    bottom: 50,
    left: -10,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: colors.orange2,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  touchable: {
    width: modalWidth,
    height: modalHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: colors.black,
    fontFamily: 'oleo-script',
  },
  bodyText: {
    color: colors.black,
    fontFamily: 'oleo-script',
  },
  icon: {
    width: modalHeight * .8,
    height: modalHeight * .8,
  }
})