import React, { memo } from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import colors from '../../assets/colors/colors'
import { BackgroundImage } from "../components/BackgroundImage"
import Screen from '../enums/Screen'
import { numberToHumanFormat } from '../math'

const WelcomeBackHeader = memo(() => (
  <View style={styles.welcomeBackHeaderWrapper}>
    <Text style={styles.welcomeBackTitleText}>Welcome back!</Text>
  </View>
))

interface WelcomeBackScreenProps {
  setScreen: (screen: Screen) => void;
  lastVisitSteps: number;
  lastVisitRevenue: number;
}

export const WelcomeBackScreen = ({setScreen, lastVisitSteps, lastVisitRevenue}: WelcomeBackScreenProps) => {
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
        <Text style={styles.stepsText}>Your actions have inspired your followers to take</Text>
        <Text style={[styles.stepsText, {color: colors.green3}]}>{numberToHumanFormat(lastVisitRevenue)} steps</Text>
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
  }

})