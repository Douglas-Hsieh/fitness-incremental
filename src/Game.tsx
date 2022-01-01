import React, { useEffect } from "react";
import { CURRENCY_GENERATORS } from "../assets/data/CurrencyGenerators";
import { GameState } from "../assets/data/GameState";
import Screen from "./enums/Screen";
import { calculateOneTickRevenue, calculateTicksToUse } from "./math";
import { HomeScreen } from "./screens/HomeScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { PrestigeScreen } from "./screens/PrestigeScreen";
import { UnlocksScreen } from "./screens/UnlocksScreen";
import { UpgradesScreen } from "./screens/UpgradesScreen";
import { WelcomeBackScreen } from "./screens/WelcomeBackScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LastVisit } from "../assets/data/LastVisit";
import useInterval from "./util/useInterval";

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

  useInterval(() => {
    // Generate revenue from ticks
    const ticksToUse = calculateTicksToUse(gameState.ticks)
    if (ticksToUse === 0) {
      return
    }
    const revenue = ticksToUse * calculateOneTickRevenue(
      CURRENCY_GENERATORS,
      gameState.generatorStateById,
      gameState.upgradeIds,
      gameState.unlockIds,
      gameState.prestige,
    );

    setGameState({
      ...gameState,
      ticks: gameState.ticks - ticksToUse,
      balance: gameState.balance + revenue,
      lifetimeEarnings: gameState.lifetimeEarnings + revenue,
    })
    console.log('ticksUsed', ticksToUse)
    console.log('revenue', revenue)
  }, 1000)

  useEffect(() => {
    // Generate ticks from steps
    
    const ticks = 20 * lastVisit.steps
    console.log('ticks', ticks)

    setGameState({
      ...gameState,
      ticks: gameState.ticks + ticks,
    })
  }, [lastVisit])

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



  }

}