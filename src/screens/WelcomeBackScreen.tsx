import React, { memo } from 'react'
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import colors from '../../assets/colors/colors'
import { TICKS_PER_STEP } from '../../assets/data/Constants'
import { GameState } from '../../assets/data/GameState'
import { BackgroundImage } from "../components/BackgroundImage"
import Screen from '../enums/Screen'

const WelcomeBackHeader = memo(() => (
  <View style={styles.welcomeBackHeaderWrapper}>
    <Text style={styles.welcomeBackTitleText}>Welcome back!</Text>
  </View>
))

interface WelcomeBackScreenProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  gameState: GameState;
}

export const WelcomeBackScreen = ({setScreen, gameState}: WelcomeBackScreenProps) => {

  const { visitHistory } = gameState
  const lastVisit = visitHistory.last()

  let lastVisitSteps = 0
  let lastVisitTicks = 0
  if (lastVisit) {
    lastVisitSteps = lastVisit.steps
    lastVisitTicks = TICKS_PER_STEP * lastVisit.steps
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage/>

      <WelcomeBackHeader/>

      <View style={styles.personalStepsWrapper}>
        <Text style={styles.personalStepsText}>
          You've taken
          <Text style={{color: colors.blue2}}> {lastVisitSteps} steps </Text>
          since your last visit.
        </Text>
      </View>

      <View style={styles.stepsWrapper}>
        <Text style={styles.stepsText}>Your actions have given your followers</Text>
        <Text style={[styles.stepsText, {color: colors.green3}]}>
          {lastVisitTicks} <Image source={require('../../assets/images/lightning.png')} style={styles.icon}/>
        </Text>
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={() => setScreen(Screen.Home)}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  
  welcomeBackHeaderWrapper: { 
    marginTop: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: '10%',
  },
  welcomeBackTitleText: {
    fontFamily: 'oleo-script',
    fontSize: 50,
    color: colors.white,
  },

  personalStepsWrapper: {
    marginTop: '10%',
    width: '90%',
    alignItems: 'center',
  },
  personalStepsText: {
    fontSize: 25,
    color: colors.white,
    textAlign: 'center',
    fontFamily: 'oleo-script',
  },

  stepsWrapper: {
    marginTop: '15%',
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: '5%',
  },
  stepsText: {
    fontSize: 25,
    fontFamily: 'oleo-script',
    textAlign: 'center',
  },

  continueButton: {
    marginTop: '30%',
    backgroundColor: colors.blue2,
    paddingHorizontal: '10%',
    paddingVertical: '5%',
    borderRadius: 10,
  },
  continueText: {
    fontSize: 25,
    fontFamily: 'oleo-script',
    textAlign: 'center',
    color: colors.white,
  },
  icon: {
    width: 25,
    height: 25,
  },
})