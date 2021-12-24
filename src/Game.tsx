import React, { useEffect, useState } from "react";
import { CURRENCY_GENERATORS } from "../assets/data/CurrencyGenerators";
import { GameState } from "../assets/data/GameState";
import Screen from "./enums/Screen";
import { calculateOneTickRevenue } from "./math";
import { HomeScreen } from "./screens/HomeScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { PrestigeScreen } from "./screens/PrestigeScreen";
import { UnlocksScreen } from "./screens/UnlocksScreen";
import { UpgradesScreen } from "./screens/UpgradesScreen";
import { WelcomeBackScreen } from "./screens/WelcomeBackScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LastVisit } from "../assets/data/LastVisit";

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

  const [lastVisitRevenue, setLastVisitRevenue] = useState<number>(0)

  useEffect(() => {
    const oneTickRevenue = calculateOneTickRevenue(
      CURRENCY_GENERATORS,
      gameState.generatorStateById,
      gameState.upgradeIds,
      gameState.unlockIds,
      gameState.prestige,
    );
    
    const revenue = oneTickRevenue * lastVisit.steps
    console.log('Revenue: ', revenue)

    setGameState({
      ...gameState,
      balance: gameState.balance + revenue,
      lifetimeEarnings: gameState.lifetimeEarnings + revenue,
    })
    setLastVisitRevenue(revenue)
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
          lastVisitRevenue={lastVisitRevenue}
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