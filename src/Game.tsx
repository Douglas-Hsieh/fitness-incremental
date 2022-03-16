import React, { useEffect, useState } from "react";
import { GameState } from "../assets/data/GameState";
import Screen from "./enums/Screen";
import { HomeScreen } from "./screens/HomeScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { PrestigeScreen } from "./screens/PrestigeScreen";
import { UnlocksScreen } from "./screens/UnlocksScreen";
import { UpgradesScreen } from "./screens/UpgradesScreen";
import { WelcomeBackScreen } from "./screens/WelcomeBackScreen";
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
import { calculateTicksToUse, calculateTicksUsedSinceLastVisit, progressGenerators } from "./math/revenue";
import { TICKS_PER_STEP } from "../assets/data/Constants";
import { AppState, AppStateStatus } from "react-native";
import { Visit } from "../assets/data/Visit";
import { calculateTemporaryMultipliers } from "./math/multipliers";
import { TasksScreen } from "./screens/TasksScreen";
import { getStepsBetween, getStepsToday } from "./fitness-api/fitness-api";

interface GameProps {
  screen: Screen;
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  isAuthorized: boolean;
  requestAuthorization: () => void;
}

export const Game = ({screen, setScreen, gameState, setGameState, requestAuthorization}: GameProps) => {

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [hasForegroundLocationPermission, setHasForegroundLocationPermission] = useState<boolean>()
  const [currentLocation, setCurrentLocation] = useState<LocationObject>();
  const [buyAmount, setBuyAmount] = useState<BuyAmount>(BuyAmount.One);
  const [visitTime, setVisitTime] = useState<Date>();
  const [temporaryMultiplier, setTemporaryMultiplier] = useState<number>(1);
  const [stepsToday, setStepsToday] = useState<number>(0)

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

    const { visitHistory } = gameState
    const lastVisit = visitHistory.last()
    if (!lastVisit) {
      // First visit
      setGameState(prevGameState => ({
        ...prevGameState,
        visitHistory: visitHistory.push(new Visit())
      }))
      return
    }
    const now = new Date()

    getStepsBetween({start: lastVisit.time, end: now})
      .then(steps => {
        const ticksEarned = TICKS_PER_STEP * steps

        // Generators progressed from ticks since last visit
        let ticksUsed = calculateTicksUsedSinceLastVisit(now, lastVisit, gameState);
        const {generatorStateById, revenue} = progressGenerators(gameState, ticksUsed)
        console.log(`Since last visit - Ticks used: ${ticksUsed}, Revenue: ${revenue}`)

        setGameState(prevGameState => ({
          ...prevGameState,
          ticks: gameState.ticks + ticksEarned - ticksUsed,
          generatorStateById: generatorStateById,
          balance: gameState.balance + revenue,
          sessionEarnings: gameState.sessionEarnings + revenue,
          visitHistory: visitHistory.push(new Visit(now, steps)),
        }))
      })
  }, [])

  useInterval(() => {
    // Generators progress and generate revenue using ticks
    const ticksToUse = calculateTicksToUse(gameState.ticks, gameState.speed)
    if (ticksToUse <= 0) return;
    const {generatorStateById, revenue} = progressGenerators(gameState, ticksToUse)

    setGameState(prevGameState => ({
      ...prevGameState,
      ticks: gameState.ticks - ticksToUse,
      generatorStateById: generatorStateById,
      balance: gameState.balance + revenue,
      sessionEarnings: gameState.sessionEarnings + revenue,
    }))

    // console.log(`Ticks used: ${ticksToUse}, Revenue: ${revenue}`)
  }, 1000)

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    // If user has no fitness location saved, ask api if one exists
    if (!gameState.fitnessLocation) {
      getFitnessLocations()
        .then(fitnessLocations => {
          const myFitnessLocations = fitnessLocations.filter(fitnessLocation => fitnessLocation.userId === gameState.user!.id)
          if (myFitnessLocations.length <= 0) {
            return;
          }
          setGameState(prevGameState => ({ ...prevGameState, fitnessLocation: myFitnessLocations[0], }))
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


  /** When app enters foreground, handle new visit */
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)
    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      setVisitTime(new Date())
    }
  }

  const handleNewVisit = async () => {
    if (gameState.visitHistory.isEmpty()) {
      return
    }
    const lastVisit = gameState.visitHistory.last()!
    const now = new Date()
    const steps = await getStepsBetween({start: lastVisit.time, end: now})
    const ticksEarned = TICKS_PER_STEP * steps

    if (steps <= 0) {
      return
    }
    setGameState(prevGameState => {
      const newVisitHistory = prevGameState.visitHistory.push(new Visit(now, steps))
      return {
        ...prevGameState,
        ticks: prevGameState.ticks + ticksEarned,
        visitHistory: newVisitHistory,
      }
    })
    setScreen(Screen.WelcomeBack)
  }

  useEffect(() => {
    if (!visitTime) {
      return
    }
    handleNewVisit()
  }, [visitTime])

  useInterval(() => {
    const temporaryMultiplier = calculateTemporaryMultipliers(gameState.temporaryMultipliers)
    setTemporaryMultiplier(temporaryMultiplier)
  }, 1000)

  useEffect(() => {
    getStepsToday().then(setStepsToday)
  }, [])

  useInterval(() => {
    getStepsToday().then(setStepsToday)
  }, 60 * 1000)

  switch(screen) {
    case Screen.Login:
      return (
        <LoginScreen handleLogin={requestAuthorization}/>
      )
    case Screen.WelcomeBack:
      return (
        <WelcomeBackScreen
          setScreen={setScreen}
          gameState={gameState}
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
          temporaryMultiplier={temporaryMultiplier}
          stepsToday={stepsToday}
          currentLocation={currentLocation}
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
          user={gameState.user}
          speed={gameState.speed}
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
    case Screen.Tasks:
      return (
        <TasksScreen
          setScreen={setScreen}
          gameState={gameState}
          setGameState={setGameState}
          stepsToday={stepsToday}
          currentLocation={currentLocation}
        />
      )

  }

}