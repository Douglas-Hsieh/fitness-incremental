import { Set } from 'immutable'
import React, { memo, useState } from 'react'
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import colors from '../../assets/colors/colors'
import { GameState, INITIAL_BALANCE } from '../../assets/data/GameState'
import { INITIAL_GENERATOR_STATE_BY_ID } from "../../assets/data/GeneratorState"
import { UpgradeState } from '../../assets/data/UpgradeState'
import { Background } from '../components/BackgroundImage'
import { BottomBar } from '../components/BottomBar'
import { Button } from '../components/Button'
import { ConfirmationModal } from '../components/ConfirmationModal'
import { Description } from '../components/Description'
import { Header } from '../components/Header'
import Screen from '../enums/Screen'
import { numberToHumanFormat } from '../math/formatting'
import { calculateEarnedPrestige, K } from "../math/prestige"

const PrestigeIcon = memo(() => (
  <Image
    source={require('../../assets/images/trainer.png')}
    style={styles.icon}
  />
))

interface PrestigeScreenProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const PrestigeScreen = ({setScreen, gameState, setGameState}: PrestigeScreenProps) => {

  const {prestige, spentPrestige, sessionEarnings: sessionEarnings, lastSessionEarnings} = gameState

  const [showClaimPrestigeModal, setShowClaimPrestigeModal] = useState<boolean>(false)
  
  const earnedPrestige = calculateEarnedPrestige(sessionEarnings, lastSessionEarnings)
  const [earnedPrestigeCoeff, earnedPrestigeScale] = numberToHumanFormat(earnedPrestige, 0, 3)

  const [prestigeCoeff, prestigeScale] = numberToHumanFormat(prestige, 0, 3)
  const [spentPrestigeCoeff, spentPrestigeScale] = numberToHumanFormat(spentPrestige, 0, 3)
  const [sessionEarningsCoeff, sessionEarningsScale] = numberToHumanFormat(sessionEarnings)
  const [lastSessionEarningsCoeff, lastSessionEarningsScale] = numberToHumanFormat(lastSessionEarnings)
  
  /** 
   * https://adventure-capitalist.fandom.com/wiki/Angel_Investors
   * Starting Lifetime Earnings is what your lifetime earnings were after your most recent reset
   * and each time you reset it is set to (400 Billion/9) • (Current angels + Sacrificed angels)^2
   */
  const resetGame = () => {
    setGameState(prevGameState => {
      
      const earnedPrestige = calculateEarnedPrestige(
        prevGameState.sessionEarnings,
        prevGameState.lastSessionEarnings
      )

      const prestigeAfterReset = prevGameState.prestige + earnedPrestige
      const lastSessionEarnings = K * Math.pow(prestigeAfterReset + prevGameState.spentPrestige, 2)

      return {
        ...prevGameState,
        balance: INITIAL_BALANCE,
        prestige: prestigeAfterReset,
        spentPrestige: 0,
        lastSessionEarnings: lastSessionEarnings,
        sessionEarnings: 0,
        generatorStateById: INITIAL_GENERATOR_STATE_BY_ID,
        upgradeState: new UpgradeState(),
        unlockIds: Set(),
      }
    })

    setScreen(Screen.Home);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Background/>
      <View style={styles.screenWrapper}>
        <Header title={'Trainers'}/>
        <Description
          title={'Teamwork makes the dream work'}
          body={'The more steps everyone takes, the more Personal Trainers you attract!\n\nThese guys make your followers a lot faster, but you’ll need to abandon your followers to hire them.'}
        />

        <View style={{width: '100%', height: 10}}/>
        <ScrollView
          style={styles.scroll}
          contentInsetAdjustmentBehavior='automatic'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >

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
          {/* <Text>Spent Prestige: {spentPrestigeCoeff} {spentPrestigeScale}</Text>
          <Text>Session Earnings: {sessionEarningsCoeff} {sessionEarningsScale}</Text>
          <Text>Last Session Earnings: {lastSessionEarningsCoeff} {lastSessionEarningsScale}</Text> */}
          <Button text={'Hire & Restart'} onPress={() => setShowClaimPrestigeModal(true)}/>
        </View>

        <View style={{width: '100%', height: 10}}/>
      </ScrollView>

      </View>
      <BottomBar screen={Screen.Prestige} setScreen={setScreen}/>

      <ConfirmationModal
        visible={showClaimPrestigeModal}
        setVisible={setShowClaimPrestigeModal}
        title={`You can hire ${earnedPrestigeCoeff} ${earnedPrestigeScale} trainers!`}
        body={"Hiring requires resetting your follower count, upgrades, and balance."}
        onConfirm={resetGame}
        onCancel={() => {}}
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
  scroll: {
    width: '100%',
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
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
    marginVertical: 10,
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