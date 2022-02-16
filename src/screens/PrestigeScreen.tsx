import { Set } from 'immutable'
import React, { memo, useState } from 'react'
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import colors from '../../assets/colors/colors'
import { GameState, INITIAL_BALANCE } from '../../assets/data/GameState'
import { INITIAL_GENERATOR_STATE_BY_ID } from "../../assets/data/GeneratorState"
import { BackgroundImage } from '../components/BackgroundImage'
import { BottomBar } from '../components/BottomBar'
import { Button } from '../components/Button'
import { ConfirmationModal } from '../components/ConfirmationModal'
import { Description } from '../components/Description'
import { Header } from '../components/Header'
import Screen from '../enums/Screen'
import { numberToHumanFormat } from '../math/formatting'
import { calculateEarnedPrestige } from "../math/prestige"

const PrestigeIcon = memo(() => (
  <Image
    source={require('../../assets/images/trainer.png')}
    style={styles.icon}
  />
))

interface PrestigeScreenProps {
  setScreen: (screen: Screen) => void;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const PrestigeScreen = ({setScreen, gameState, setGameState}: PrestigeScreenProps) => {

  const [showClaimPrestigeModal, setShowClaimPrestigeModal] = useState<boolean>(false) 

  const resetGame = () => {

    const earnedPrestige = calculateEarnedPrestige(gameState.lifetimeEarningsSinceBeginning, gameState.lifetimeEarningsSinceLastReset)
    const prestigeAfterReset = gameState.prestige + earnedPrestige

    // https://adventure-capitalist.fandom.com/wiki/Angel_Investors
    setGameState(prevGameState => ({
      ...prevGameState,
      balance: INITIAL_BALANCE,
      prestige: prestigeAfterReset,
      spentPrestige: 0,
      lifetimeEarningsSinceLastReset: (4e+11 / 9) * Math.pow(prestigeAfterReset + gameState.spentPrestige, 2),
      generatorStateById: INITIAL_GENERATOR_STATE_BY_ID,
      upgradeIds: Set(),
      unlockIds: Set(),
    }))
  }

  const [prestigeCoeff, prestigeScale] = numberToHumanFormat(gameState.prestige)
  const [earnedPrestigeCoeff, earnedPrestigeScale] = numberToHumanFormat(calculateEarnedPrestige(gameState.lifetimeEarningsSinceBeginning, gameState.lifetimeEarningsSinceLastReset))

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage/>
      <View style={styles.screenWrapper}>
        <Header title={'Trainers'}/>
        <Description
          title={'Teamwork makes the dream work'}
          body={'The more steps everyone takes, the more Personal Trainers you attract! These world class instructors provide huge bonuses but you’ll need to restart your business to hire them.'}
        />

        <View style={styles.prestigeStatusWrapper}>
          <PrestigeIcon/>
          <View style={styles.prestigeStatusTextWrapper}>
            <Text style={styles.prestigeStatusTitle}>Personal Trainers Employed</Text>
            <Text style={styles.prestigeStatusBody}>{prestigeCoeff} {prestigeScale}</Text>
          </View>
          <PrestigeIcon/>
        </View>

        <View style={styles.restartWrapper}>
          <Text style={styles.restartTitle}>Trainers Hired on Restart</Text>
          <Text style={styles.restartBody1}>{earnedPrestigeCoeff} {earnedPrestigeScale}</Text>
          <Text style={styles.restartBody2}>2% Step Bonus Per Trainer!</Text>
          <Button text={'Hire & Restart'} onPress={() => setShowClaimPrestigeModal(true)}/>
        </View>

      </View>
      <BottomBar screen={Screen.Prestige} setScreen={setScreen}/>

      <ConfirmationModal
        visible={showClaimPrestigeModal}
        title={`You can hire ${earnedPrestigeCoeff} ${earnedPrestigeScale} trainers!`}
        body={"Hiring requires resetting your follower count, upgrades, and balance."}
        onConfirm={() => {
          resetGame()
          setShowClaimPrestigeModal(false)
        }}
        onCancel={() => {setShowClaimPrestigeModal(false)}}
      />
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