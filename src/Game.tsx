import React, { useEffect } from "react";
import { CURRENCY_GENERATORS_BY_ID } from "../assets/data/CurrencyGenerators";
import { GameState } from "../assets/data/GameState";
import Screen from "./enums/Screen";
import { calculateGeneratorRevenue, calculateTicksToUse } from "./math";
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
    // User took steps since last visit
    const ticks = 20 * lastVisit.steps
    console.log('ticks', ticks)

    setGameState({
      ...gameState,
      ticks: gameState.ticks + ticks,
      stepsUntilNextRandomReward: gameState.stepsUntilNextRandomReward - lastVisit.steps
    })
  }, [lastVisit])

  useInterval(() => {
    // Generators progress and generate revenue using ticks
    const ticksToUse = calculateTicksToUse(gameState.ticks)
    if (ticksToUse === 0) {
      return
    }
    let revenue = 0

    const generatorStateById = gameState.generatorStateById.withMutations(genStateById => {
      Array.from(genStateById.entries())
        .forEach(([id, genState]) => {

          const generator = CURRENCY_GENERATORS_BY_ID.get(id)!
          const newTicks = genState.ticks + ticksToUse

          if (newTicks >= generator.initialTicks) {
            const timesProduced = Math.floor(newTicks / generator.initialTicks)
            genStateById.set(id, {
              ...genState,
              ticks: newTicks % generator.initialTicks,
            })
            revenue += timesProduced * calculateGeneratorRevenue(generator, gameState)
          } else {
            genStateById.set(id, {
              ...genState,
              ticks: newTicks,
            })
          }
        })
    })

    setGameState({
      ...gameState,
      generatorStateById: generatorStateById,
      ticks: gameState.ticks - ticksToUse,
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