import React, { useEffect, useState } from "react";
import { GameState } from "../assets/data/GameState";
import Screen from "./enums/Screen";
import { calculateTicksToUse, progressGenerators } from "./math/math";
import { HomeScreen } from "./screens/HomeScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { PrestigeScreen } from "./screens/PrestigeScreen";
import { UnlocksScreen } from "./screens/UnlocksScreen";
import { UpgradesScreen } from "./screens/UpgradesScreen";
import { WelcomeBackScreen } from "./screens/WelcomeBackScreen";
import { LastVisit } from "../assets/data/LastVisit";
import useInterval from "./util/useInterval";
import { MiscellaneousScreen } from "./screens/MiscellaneousScreen";
import { WorkoutScreen } from './screens/WorkoutScreen'
import { FitnessLocationAdminScreen } from "./screens/FitnessLocationAdminScreen";
import { Accuracy, LocationObject, requestForegroundPermissionsAsync, watchPositionAsync } from "expo-location";
import { registerForPushNotificationsAsync } from "./push-notifications";
import { getFitnessLocations } from "./api/fitness-locations";
import { createUser, updateUser } from "./api/users";
import { logIn } from "./api/auth";
import BuyAmount from "./enums/BuyAmount";

interface GameProps {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  lastVisit: LastVisit;
  isAuthorized: boolean;
  requestAuthorizationFromGoogleFit: () => void;
}

export const Game = ({screen, setScreen, gameState, setGameState, lastVisit, requestAuthorizationFromGoogleFit}: GameProps) => {

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [hasForegroundLocationPermission, setHasForegroundLocationPermission] = useState<boolean>()
  const [currentLocation, setCurrentLocation] = useState<LocationObject>();
  const [buyAmount, setBuyAmount] = useState<BuyAmount>(BuyAmount.One);

  useEffect(() => {
    const getAndSetUser = async () => {
      if (!gameState.user) {
        const user = await createUser();
        setGameState(prevGameState => ({ ...prevGameState, user: user, }))
      }
    }
    getAndSetUser()
  }, [])

  useEffect(() => {
    if (gameState.user && !isLoggedIn) {
      logIn(gameState.user.uuid)
        .then((user) => {
          setGameState(prevGameState => ({ ...prevGameState, user: user, }))
          setIsLoggedIn(true)
        })
    }
  }, [gameState.user, isLoggedIn])

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
      const ticksToUse = calculateTicksToUse(ticksRemaining, gameState.speed)
      ticksRemaining -= ticksToUse
      ticksToUseTotal += ticksToUse
    }
    const {generatorStateById, revenue} = progressGenerators(gameState, ticksToUseTotal)

    console.log('ticksToUse since last visit', ticksToUseTotal)
    console.log('revenue since last visit', revenue)

    setGameState(prevGameState => ({
      ...prevGameState,
      stepsUntilNextRandomReward: gameState.stepsUntilNextRandomReward - lastVisit.steps,
      ticks: gameState.ticks + ticks - ticksToUseTotal,
      generatorStateById: generatorStateById,
      balance: gameState.balance + revenue,
      lifetimeEarnings: gameState.lifetimeEarnings + revenue,
    }))
  }, [])

  useInterval(() => {
    // Generators progress and generate revenue using ticks
    const ticksToUse = calculateTicksToUse(gameState.ticks, gameState.speed)
    if (ticksToUse <= 0) {
      return
    }
    const {generatorStateById, revenue} = progressGenerators(gameState, ticksToUse)

    setGameState(prevGameState => ({
      ...prevGameState,
      ticks: gameState.ticks - ticksToUse,
      generatorStateById: generatorStateById,
      balance: gameState.balance + revenue,
      lifetimeEarnings: gameState.lifetimeEarnings + revenue,
    }))

    console.log('ticksToUse', ticksToUse)
    console.log('revenue', revenue)
  }, 1000)

  // Autosave game
  useEffect(() => {
    GameState.save(gameState)
  }, [gameState])

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    // If user has no fitness location saved, ask api if one exists
    if (!gameState.fitnessLocation) {
      getFitnessLocations()
        .then(fitnessLocations => {
          if (fitnessLocations.length <= 0) {
            return;
          }
          setGameState(prevGameState => ({ ...prevGameState, fitnessLocation: fitnessLocations[0], }))
        })
    }

    // Register for push notifications
    registerForPushNotificationsAsync()
      .then(token => updateUser({ id: gameState.user!.id, expoPushToken: token }))
  }, [isLoggedIn])

  useEffect(() => {
    if (!gameState.fitnessLocation) {
      return
    }
    if (!hasForegroundLocationPermission) {
      requestForegroundPermissionsAsync()
        .then(response => { setHasForegroundLocationPermission(response.status === 'granted') })
    } else {
      watchPositionAsync({ accuracy: Accuracy.High, timeInterval: 30000 }, (location) => {
        setCurrentLocation(location)
      })
    }
  }, [gameState.fitnessLocation, hasForegroundLocationPermission])

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
          buyAmount={buyAmount}
          setBuyAmount={setBuyAmount}
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
          gameState={gameState}
          setGameState={setGameState}
        />
      )
    case Screen.Workout:
      return (
        <WorkoutScreen
          setScreen={setScreen}
          gameState={gameState}
          setGameState={setGameState}
          currentLocation={currentLocation}
        />
      )
    case Screen.FitnessLocationAdmin:
      return (
        <FitnessLocationAdminScreen
          setScreen={setScreen}
          setGameState={setGameState}
        />
      )

  }

}