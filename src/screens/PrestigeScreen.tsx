import { Set } from 'immutable'
import React, { memo } from 'react'
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import colors from '../../assets/colors/colors'
import { GameState, INITIAL_GENERATOR_STATE_BY_ID } from '../../assets/data/GameState'
import { BackgroundImage } from '../components/BackgroundImage'
import { BottomBar } from '../components/BottomBar'
import { Description } from '../components/Description'
import { Header } from '../components/Header'
import Screen from '../enums/Screen'
import { calculateEarnedPrestige } from '../math'

const PrestigeIcon = memo(() => (
  <Image
    source={require('../../assets/images/trainer.png')}
    style={styles.icon}
  />
))

interface PrestigeScreenProps {
  setScreen: (screen: Screen) => void;
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
}

export const PrestigeScreen = ({setScreen, gameState, setGameState}: PrestigeScreenProps) => {
  
  const resetGame = () => {

    const earnedPrestige = calculateEarnedPrestige(gameState.lifetimeEarnings, gameState.startingLifetimeEarnings)
    const prestigeAfterReset = gameState.prestige + earnedPrestige

    // https://adventure-capitalist.fandom.com/wiki/Angel_Investors
    setGameState({
      balance: 0,
      prestige: prestigeAfterReset,
      spentPrestige: 0,
      startingLifetimeEarnings: (4e+11 / 9) * Math.pow(prestigeAfterReset + gameState.spentPrestige, 2),
      lifetimeEarnings: gameState.lifetimeEarnings,
      generatorStateById: INITIAL_GENERATOR_STATE_BY_ID,
      upgradeIds: Set(),
      unlockIds: Set(),
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage/>
      <View style={styles.screenWrapper}>
        <Header title={'Trainers'}/>
        <Description
          title={'Teamwork makes the dream work'}
          body={'The more steps everyone takes, the more Personal Trainers you attract! These world class instructors provide huge bonuses but you’ll need to abandon your followers to hire them.'}
        />

        <View style={styles.prestigeStatusWrapper}>
          <PrestigeIcon/>
          <View style={styles.prestigeStatusTextWrapper}>
            <Text style={styles.prestigeStatusTitle}>Personal Trainers Employed</Text>
            <Text style={styles.prestigeStatusBody}>{gameState.prestige.toFixed()}</Text>
          </View>
          <PrestigeIcon/>
        </View>

        <View style={styles.restartWrapper}>
          <Text style={styles.restartTitle}>Trainers Hired on Restart</Text>
          <Text style={styles.restartBody1}>{calculateEarnedPrestige(gameState.lifetimeEarnings, gameState.startingLifetimeEarnings).toFixed()}</Text>
          <Text style={styles.restartBody2}>2% Step Bonus Per Trainer!</Text>
          <TouchableOpacity style={styles.restartButton} onPress={resetGame}>
            <Text style={styles.restartButtonText}>Hire & Restart</Text>
          </TouchableOpacity>
        </View>

      </View>
      <BottomBar screen={Screen.Prestige} setScreen={setScreen}/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
    alignItems: 'center',
  },

  prestigeStatusWrapper: {
    marginTop: '5%',
    width: '90%',
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  icon: {
    width: 70,
    height: 70,
  },
  prestigeStatusTextWrapper: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  prestigeStatusTitle: {
    color: colors.orange3,
    fontFamily: 'oleo-script'
    
  },
  prestigeStatusBody: {

  },

  restartWrapper: {
    marginTop: '5%',
    width: '90%',
    paddingVertical: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderRadius: 10,
  },
  restartTitle: {
    color: colors.orange3,
    fontFamily: 'oleo-script',
  },
  restartBody1: {
    marginTop: 10,
  },
  restartBody2: {
    marginTop: 5,
  },
  restartButton: {
    marginTop: 10,
    backgroundColor: colors.orange3,
    padding: 15,
    borderRadius: 10,
  },
  restartButtonText: {
    color: colors.white,
    fontFamily: 'oleo-script',
    fontSize: 20,
  }
})