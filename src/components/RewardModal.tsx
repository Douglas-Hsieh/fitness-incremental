import React, { useEffect, useState } from "react"
import { Image, Text } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import colors from "../../assets/colors/colors"
import { Reward } from "../rewards"
import RewardModalDetails from "../types/RewardModalDetails"
import { playSound, SoundFile } from "../util/sounds"
import { window } from "../util/Window"
import { Button } from "./Button"

interface RewardModalProps {
  details: RewardModalDetails
  onClose: () => void;
}

export const RewardModal = ({details, onClose}: RewardModalProps) => {
  const {reward, title, body} = details

  const [showReward, setShowReward] = useState<boolean>(false)

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
    showModal(true)
    playSound(SoundFile.CoinWinning)
  }, [])

  const clueImage = require('../../assets/images/clue.png')
  let rewardImage
  if (reward === Reward.Nothing) {
    rewardImage = require('../../assets/images/garbage.png')
  } else if (reward === Reward.InstantBonus) {
    rewardImage = require('../../assets/images/steps.png')
  } else if (reward === Reward.TemporaryMultiplier) {
    rewardImage = require('../../assets/images/hourglass.png')
  }

  return (
    <Animated.View style={[styles.modal, animatedStyle]}>
      { !showReward &&
        <>
          <Text style={styles.title}>{'Potential Reward'}</Text>
          <Image source={clueImage} style={styles.icon}/>
          <Text style={styles.body}>{'You spot something in the distance...'}</Text>
          <Button text={'Examine'} onPress={() => {
            setShowReward(true)
          }}/>
        </>
      }
      { showReward &&
        <>
          <Text style={styles.title}>{title}</Text>
          <Image source={rewardImage} style={styles.icon}/>
          <Text style={styles.body}>{body}</Text>
          <Button text={'Claim'} onPress={() => {
            showModal(false)
            playSound(SoundFile.Winning)
            onClose()
          }}/>
        </>
      }
    </Animated.View>
  )
}

const styles = EStyleSheet.create({
  modal: {
    position: 'absolute',
    marginLeft: window.width / 6,
    marginTop: window.height / 4,
    width: window.width / 1.5,
    height: window.width / 1.5,
    maxHeight: window.height / 1.5,
    backgroundColor: colors.white,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  icon: {
    width: window.width / 5,
    height: window.width / 5,
  },
  title: {
    fontSize: '1.2rem',
  },
  body: {
    fontSize: '.9rem',
  },
})