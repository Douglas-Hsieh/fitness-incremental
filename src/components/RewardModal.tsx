import React, { useEffect, useState } from "react"
import { Image, Text } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import colors from "../../assets/colors/colors"
import { RewardInstantBonus, RewardNothing, RewardPermanentMultiplier, RewardTemporaryMultiplier } from "../rewards"
import RewardModalDetails from "../types/RewardModalDetails"
import { playSound, SoundFile } from "../util/sounds"
import useInterval from "../util/useInterval"
import { window } from "../util/Window"
import { Button } from "./Button"

const PresentImage = () => (
  <Image source={require('../../assets/images/present.png')} style={styles.icon}/>
)

const RewardNothingImage = () => (
  <Image source={require('../../assets/images/garbage.png')} style={styles.icon}/>
)

const RewardInstantBonusImage = () => (
  <Image source={require('../../assets/images/steps.png')} style={styles.icon}/>
)

const RewardTemporaryMultiplierImage = () => (
  <Image source={require('../../assets/images/hourglass.png')} style={styles.icon}/>
)

const RewardPermanentMultiplierImage = () => (
  <Image source={require('../../assets/images/stars.png')} style={styles.icon}/>
)

const rewardImages = [
  RewardNothingImage,
  RewardInstantBonusImage,
  RewardTemporaryMultiplierImage,
  RewardPermanentMultiplierImage,
]

interface RewardModalProps {
  details: RewardModalDetails
  onClose: () => void;
}

export const RewardModal = ({details, onClose}: RewardModalProps) => {
  const {reward, title, body} = details

  const [showRandomReward, setShowRandomReward] = useState<boolean>(false)
  const [showReward, setShowReward] = useState<boolean>(false)
  const [randomRewardImage, setRandomRewardImage] = useState<JSX.Element>(RewardNothingImage)

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

  let rewardImage
  if (reward instanceof RewardNothing) {
    rewardImage = require('../../assets/images/garbage.png')
  } else if (reward instanceof RewardInstantBonus) {
    rewardImage = require('../../assets/images/steps.png')
  } else if (reward instanceof RewardTemporaryMultiplier) {
    rewardImage = require('../../assets/images/hourglass.png')
  } else if (reward instanceof RewardPermanentMultiplier) {
    rewardImage = require('../../assets/images/stars.png')
  }

  useInterval(() => {
    const randomImage = rewardImages[Math.floor(Math.random() * rewardImages.length)]
    setRandomRewardImage(randomImage)
  }, 150)

  return (
    <Animated.View style={[styles.modal, animatedStyle]}>
      { !showRandomReward && !showReward &&
        <>
          <Text style={styles.title}>{'Fitness Box'}</Text>
          <PresentImage/>
          <Text style={styles.body}>{"Great effort! Take this gift for exercising today"}</Text>
          <Button text={'Open'} onPress={() => {
            setShowRandomReward(true)
          }}/>
        </>
      }
      { showRandomReward && !showReward &&
        <>
          <Text style={styles.title}>{'Fitness Box'}</Text>
          { randomRewardImage }
          <Text style={styles.body}>{"Great effort! Take this gift for exercising today"}</Text>
          <Button text={'Claim'} onPress={() => {
            setShowRandomReward(false)
            setShowReward(true)
            playSound(SoundFile.Winning)
          }}/>
        </>
      }
      { !showRandomReward && showReward &&
        <>
          <Text style={styles.title}>{title}</Text>
          <Image source={rewardImage} style={styles.icon}/>
          <Text style={styles.body}>{body}</Text>
          <Button text={'Ok'} onPress={() => {
            showModal(false)
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
    padding: 10,
  },
  icon: {
    width: window.width / 5,
    height: window.width / 5,
  },
  title: {
    fontSize: '1.2rem',
  },
  body: {
    fontSize: '1rem',
    textAlign: 'center',
  },
})