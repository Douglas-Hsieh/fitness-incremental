import React, { memo } from 'react'
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import colors from '../../assets/colors/colors'
import { FancyBackground } from "../components/BackgroundImage"
import Screen from '../enums/Screen'
import { numberToHumanFormat } from '../math/formatting'
import { LastVisitStats } from '../types/LastVisitStats'
import { ScrollView } from "react-native-gesture-handler"

const WelcomeBackHeader = memo(() => (
  <View style={styles.welcomeBackHeaderWrapper}>
    <Text style={styles.welcomeBackTitleText}>Welcome back!</Text>
  </View>
))

interface WelcomeBackScreenProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  lastVisitStats: LastVisitStats;
}

export const WelcomeBackScreen = ({setScreen, lastVisitStats}: WelcomeBackScreenProps) => {
  const { steps, ticks, revenue, ticksUsed } = lastVisitStats
  const [revenueCoefficient, revenueScale] = numberToHumanFormat(revenue, 0, 2);

  return (
    <SafeAreaView style={styles.container}>
      <FancyBackground/>

      <WelcomeBackHeader/>

      <ScrollView
        style={styles.scroll}
        contentInsetAdjustmentBehavior='automatic'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >

      <View style={styles.descriptionWrapper}>
        <Text style={styles.descriptionText}>
          You have taken
          {'\n'}
          <Text style={{color: colors.blue2}}>{steps} steps</Text>
          {'\n'}
          which has generated
          {'\n'}
          <Text style={{color: colors.green3}}>{ticks}</Text> <Image source={require('../../assets/images/lightning.png')} style={styles.icon}/>
        </Text>
      </View>

      <View style={styles.descriptionWrapper}>
        <Text style={styles.descriptionText}>
          Your followers <Image source={require('../../assets/images/puppy.png')} style={styles.icon}/> produced
          {'\n'}
          <Text style={{color: colors.green3}}>{revenueCoefficient} {revenueScale}</Text> <Image source={require('../../assets/images/steps.png')} style={styles.icon}/>
          {'\n'}
          and consumed
          {'\n'}
          <Text style={{color: colors.red}}>{ticksUsed}</Text>
          <Image source={require('../../assets/images/lightning.png')} style={styles.icon}/>
        </Text>
      </View>


      <TouchableOpacity style={styles.continueButton} onPress={() => setScreen(Screen.Home)}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>

      </ScrollView>

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

  descriptionWrapper: {
    marginTop: '3%',
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: '5%',
  },
  descriptionText: {
    fontSize: 25,
    fontFamily: 'oleo-script',
    textAlign: 'center',
  },

  continueButton: {
    marginTop: '15%',
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

  scroll: {
    width: '100%',
  },
  scrollContentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
})