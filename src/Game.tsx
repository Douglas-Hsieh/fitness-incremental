import React, { useEffect } from "react";
import { GameState } from "../assets/data/GameState";
import Screen from "./enums/Screen";
import { calculateTicksToUse, progressGenerators } from "./math";
import { HomeScreen } from "./screens/HomeScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { PrestigeScreen } from "./screens/PrestigeScreen";
import { UnlocksScreen } from "./screens/UnlocksScreen";
import { UpgradesScreen } from "./screens/UpgradesScreen";
import { WelcomeBackScreen } from "./screens/WelcomeBackScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LastVisit } from "../assets/data/LastVisit";
import useInterval from "./util/useInterval";
import { MiscellaneousScreen } from "./screens/MiscellaneousScreen";

interface GameProps {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
  lastVisit: LastVisit;
  isAuthorized: boolean;
  requestAuthorizationFromGoogleFit: () => void;
}

export const Game = ({screen, setScreen, gameState, setGameState, lastVisit, requestAuthorizationFromGoogleFit}: GameProps) => {

  useEffect(() => {
    // User earned ticks from steps since last visit
    const ticks = 20 * lastVisit.steps
    console.log('ticks', ticks)

    // Generators progressed from ticks since last visit
    const now = new Date()
    const secondsLastVisit = (now.getTime() - lastVisit.time.getTime()) / 1000;
    let ticksRemaining = gameState.ticks
    let ticksToUseTotal = 0
    for (let i = 0; i < secondsLastVisit; ++i) {
      const ticksToUse = calculateTicksToUse(ticksRemaining)
      ticksRemaining -= ticksToUse
      ticksToUseTotal += ticksToUse
    }
    const {generatorStateById, revenue} = progressGenerators(gameState, ticksToUseTotal)

    console.log('ticksToUse since last visit', ticksToUseTotal)
    console.log('revenue since last visit', revenue)

    setGameState({
      ...gameState,
      stepsUntilNextRandomReward: gameState.stepsUntilNextRandomReward - lastVisit.steps,
      ticks: gameState.ticks + ticks - ticksToUseTotal,
      generatorStateById: generatorStateById,
      balance: gameState.balance + revenue,
      lifetimeEarnings: gameState.lifetimeEarnings + revenue,
    })
  }, [lastVisit])

  useInterval(() => {
    // Generators progress and generate revenue using ticks
    const ticksToUse = calculateTicksToUse(gameState.ticks)
    if (ticksToUse <= 0) {
      return
    }
    const {generatorStateById, revenue} = progressGenerators(gameState, ticksToUse)

    setGameState({
      ...gameState,
      ticks: gameState.ticks - ticksToUse,
      generatorStateById: generatorStateById,
      balance: gameState.balance + revenue,
      lifetimeEarnings: gameState.lifetimeEarnings + revenue,
    })

    console.log('ticksToUse', ticksToUse)
    console.log('revenue', revenue)
  }, 1000)

  // Autosave game
  useEffect(() => {
    AsyncStorage.setItem('gameState', JSON.stringify(gameState))
  }, [gameState])

  switch(screen) {
    case Screen.Login:
      return (
        <LoginScreen handleLogin={requestAuthorizationFromGoogleFit}/>
      )
    case Screen.WelcomeBack:
      return (
        <WelcomeBackScreen
          setScreen={setScreen}
          lastVisitSteps={lastVisit.steps}
        />
      )
    case Screen.Home:
      return (
        <HomeScreen
          setScreen={setScreen}
          gameState={gameState}
          setGameState={setGameState}
        />
      )
    case Screen.Upgrades:
      return (
        <UpgradesScreen
          setScreen={setScreen}
          gameState={gameState}
          setGameState={setGameState}
        />
      )
    case Screen.Unlocks:
      return (
        <UnlocksScreen
          setScreen={setScreen}
          gameState={gameState}
        />
      )
    case Screen.Prestige:
      return (
        <PrestigeScreen
          setScreen={setScreen}
          gameState={gameState}
          setGameState={setGameState}
        />
      )
    case Screen.Miscellaneous:
      return (
        <MiscellaneousScreen
          setScreen={setScreen}
          setGameState={setGameState}
        />
      )


  }

}