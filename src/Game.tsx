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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LastVisit } from "../assets/data/LastVisit";
import useInterval from "./util/useInterval";
import { MiscellaneousScreen } from "./screens/MiscellaneousScreen";
import { WorkoutScreen } from "./screens/WorkoutScreen";
import { FitnessLocationAdminScreen } from "./screens/FitnessLocationAdminScreen";
import { Accuracy, LocationObject, requestForegroundPermissionsAsync, watchPositionAsync } from "expo-location";
import { registerForPushNotificationsAsync } from "./push-notifications";
import { getFitnessLocations } from "./api/fitness-locations";
import { createUser, updateUser } from "./api/users";
import { logIn } from "./api/auth";

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

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [hasForegroundLocationPermission, setHasForegroundLocationPermission] = useState<boolean>()
  const [currentLocation, setCurrentLocation] = useState<LocationObject>();

  useEffect(() => {
    const getAndSetUser = async () => {
      if (!gameState.user) {
        const user = await createUser();
        setGameState({ ...gameState, user: user })
      }
    }
    getAndSetUser()
  }, [])

  useEffect(() => {
    if (gameState.user && !isLoggedIn) {
      logIn(gameState.user.uuid).then(() => setIsLoggedIn(true))
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

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    // If user has no fitness location saved, ask api if one exists
    if (gameState.fitnessLocation) {
      getFitnessLocations()
        .then(fitnessLocations => {
          if (fitnessLocations.length <= 0) {
            return;
          }
          setGameState({
            ...gameState,
            fitnessLocation: fitnessLocations[0],
          })
        })
    }

    // Register for push notifications
    registerForPushNotificationsAsync()
      .then(token => updateUser({ id: gameState.user!.id, expoPushToken: token }))
  }, [isLoggedIn])

  useEffect(() => {
    // If user has fitness location, ask to track foreground location
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