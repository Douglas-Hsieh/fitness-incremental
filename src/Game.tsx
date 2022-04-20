import React, { useEffect, useState } from "react";
import { GameState } from "../assets/data/GameState";
import Screen from "./enums/Screen";
import { HomeScreen } from "./screens/HomeScreen";
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
import { calculateTicksToUse, calculateTicksUsedSinceLastVisit, hasWorkingGenerator, progressGenerators } from "./math/revenue";
import { TICKS_PER_STEP } from "../assets/data/Constants";
import { AppState, AppStateStatus, Pressable, StyleSheet } from "react-native";
import { Visit } from "../assets/data/Visit";
import { calculateTemporaryMultipliers } from "./math/multipliers";
import { TasksScreen } from "./screens/TasksScreen";
import { getStepsBetween, getStepsToday } from "./fitness-api/fitness-api";
import { getUpgradeId, MANAGER_UPGRADES, UpgradeType } from "../assets/data/Upgrades";
import { calculatePrice } from "./math/prices";
import { GENERATORS } from "../assets/data/Generators";
import { TutorialState } from "../assets/data/TutorialState";
import { HighlightId } from "./enums/HightlightId";
import { HighlightType } from "./enums/HighlightType";
import { HighlightOverlay } from "react-native-highlight-overlay";
import { DialogueModal } from "./components/DialogueModal";
import { dateToYYYYMMDDFormat } from "./math/formatting";
import { FitnessReward } from "./rewards";
import { StepsReward } from "./components/StepsReward";
import { WorkoutReward } from "./components/WorkoutReward";

interface GameProps {
  screen: Screen;
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const Game = ({ screen, setScreen, gameState, setGameState }: GameProps) => {

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [hasForegroundLocationPermission, setHasForegroundLocationPermission] = useState<boolean>()
  const [currentLocation, setCurrentLocation] = useState<LocationObject>();
  const [buyAmount, setBuyAmount] = useState<BuyAmount>(BuyAmount.One);
  const [upgradeType, setUpgradeType] = useState<UpgradeType>(UpgradeType.GeneratorMultiplierCashUpgrade)
  const [visitTime, setVisitTime] = useState<Date>();
  const [temporaryMultiplier, setTemporaryMultiplier] = useState<number>(1);

  const [stepsToday, setStepsToday] = useState<number>(0)
  const [showDialogueModal, setShowDialogueModal] = useState<boolean>(false)
  const [dialogueText, setDialogueText] = useState<string>('')
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [generatorsHighlightId, setGeneratorsHighlightId] = useState<string | null>(null)
  const [onScreenPress, setOnScreenPress] = useState<(() => void) | null>(null)

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
    // // Dangerous: can stop the game loop
    // if (showDialogueModal) {
    //   return
    // }

    if (!hasWorkingGenerator(gameState)) {
      return
    }

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


  /** Update fitness rewards */
  useEffect(() => {
    const today = dateToYYYYMMDDFormat(new Date())

    setGameState(prevGameState => {
      const fitnessRewards = prevGameState.fitnessRewardsByDate.get(today)
      const fitnessRewardsByDate = fitnessRewards
        ? prevGameState.fitnessRewardsByDate.set(today, fitnessRewards.set("steps", stepsToday))
        : prevGameState.fitnessRewardsByDate.set(today, new FitnessReward().set("steps", stepsToday))
      return ({
        ...prevGameState,
        fitnessRewardsByDate: fitnessRewardsByDate,
      })
    })
  }, [stepsToday])


  function showTutorial(highlightId: HighlightId | null, highlightType: HighlightType, text: string) {
    // if (highlightType === HighlightType.All) {
    //   setHighlightId(highlightId)
    // } else if (highlightType === HighlightType.Generators) {
    //   setGeneratorsHighlightId(highlightId)
    // }
    setDialogueText(text)
    setShowDialogueModal(true)
  }

  function hideTutorial() {
    setHighlightId(null)
    setGeneratorsHighlightId(null)
    setDialogueText('')
    setShowDialogueModal(false)
  }
  function completeTutorial(key: keyof TutorialState) {
    setGameState(prevGameState => ({
      ...prevGameState,
      tutorialState: {
        ...prevGameState.tutorialState,
        [key]: {
          ...prevGameState.tutorialState[key],
          isCompleted: true,
        }
      }
    }))
  }
  function hideAndCompleteTutorial(key: keyof TutorialState) {
    hideTutorial()
    completeTutorial(key)
  }

  function setOnFirstScreenPress(onFirstScreenPress: () => void) {
    setOnScreenPress(() => () => {
      onFirstScreenPress()
      setOnScreenPress(null)
    })
  }

  // /* Tutorial */
  const { tutorialState } = gameState

  useEffect(() => {
    // ios: breaks on v1.2.1 (goes to loading screen)
    // android: breaks on v1.3.0 (multiple ui glitch)
    // showTutorial(HighlightId.Generator1, HighlightType.Generators, tutorialState.firstGenerator1.message)
  }, [])

  // Start tutorial
  useEffect(() => {
    if (showDialogueModal) {
      return
    }

    if (!tutorialState.firstGenerator1.isCompleted) {
      showTutorial(HighlightId.Generator1, HighlightType.Generators, tutorialState.firstGenerator1.message)
    } else if (!tutorialState.firstGenerator2.isCompleted && gameState.balance >= calculatePrice(1, GENERATORS[0].initialPrice, GENERATORS[0].growthRate, 1)) {
      showTutorial(HighlightId.Generator1, HighlightType.Generators, tutorialState.firstGenerator2.message)
    } else if (!tutorialState.firstGenerator3.isCompleted && tutorialState.firstGenerator2.isCompleted) {
      showTutorial(null, HighlightType.Generators, tutorialState.firstGenerator3.message)
      setOnFirstScreenPress(() => hideAndCompleteTutorial('firstGenerator3'))
    } else if (!tutorialState.ticks1.isCompleted && gameState.balance > 250) {
      showTutorial(HighlightId.Ticks, HighlightType.All, tutorialState.ticks1.message)
      setOnFirstScreenPress(() => hideAndCompleteTutorial('ticks1'))
    } else if (!tutorialState.ticks2.isCompleted && tutorialState.ticks1.isCompleted) {
      showTutorial(HighlightId.Ticks, HighlightType.All, tutorialState.ticks2.message)
      setOnFirstScreenPress(() => hideAndCompleteTutorial('ticks2'))
    } else if (!tutorialState.manager1.isCompleted && gameState.balance >= MANAGER_UPGRADES[0].price) {
      showTutorial(HighlightId.UpgradesTab, HighlightType.All, tutorialState.manager1.message)
    } else if (!tutorialState.manager2.isCompleted && tutorialState.manager1.isCompleted) {
      showTutorial(HighlightId.ManagerUpgrades, HighlightType.All, tutorialState.manager2.message)
    } else if (!tutorialState.manager3.isCompleted && tutorialState.manager2.isCompleted) {
      showTutorial(HighlightId.ManagerUpgrade1, HighlightType.All, tutorialState.manager3.message)
    } else if (!tutorialState.prestige.isCompleted && gameState.prestige >= 100) {
      showTutorial(HighlightId.PrestigeTab, HighlightType.All, tutorialState.prestige.message)
    }
  }, [gameState])

  // End tutorial
  useEffect(() => {
    if (!dialogueText) return

    if (dialogueText === tutorialState.firstGenerator1.message && tutorialState.firstGenerator1.isCompleted) {
      hideTutorial()
    }
  }, [gameState.tutorialState])

  useEffect(() => {
    if (!dialogueText) return

    if (dialogueText === tutorialState.firstGenerator2.message && gameState.generatorStateById.get('1')!.owned > 1) {
      hideAndCompleteTutorial("firstGenerator2")
    }
  }, [gameState.generatorStateById.get('1')!.owned])

  useEffect(() => {
    if (!dialogueText) return

    if (dialogueText === tutorialState.manager1.message && screen === Screen.Upgrades) {
      hideAndCompleteTutorial('manager1')
    }
  }, [screen])

  useEffect(() => {
    if (!dialogueText) return

    if (dialogueText === tutorialState.manager2.message && screen === Screen.Upgrades && upgradeType === UpgradeType.ManagerUpgrade) {
      hideAndCompleteTutorial('manager2')
    }
  }, [screen, upgradeType])

  useEffect(() => {
    if (!dialogueText) return

    if (dialogueText === tutorialState.manager3.message && gameState.upgradeState.managerUpgradeIds.contains(getUpgradeId(MANAGER_UPGRADES[0]))) {
      hideAndCompleteTutorial('manager3')
    }
  }, [gameState.upgradeState.managerUpgradeIds])

  useEffect(() => {
    if (!dialogueText) return

    if (dialogueText === tutorialState.prestige.message && screen === Screen.Prestige) {
      hideAndCompleteTutorial('prestige')
    }
  }, [screen])

  switch(screen) {
    case Screen.WelcomeBack:
      return (
        <WelcomeBackScreen
          setScreen={setScreen}
          gameState={gameState}
        />
      )
    case Screen.Home:
      return (
        <>
          <HomeScreen
            setScreen={setScreen}
            gameState={gameState}
            setGameState={setGameState}
            buyAmount={buyAmount}
            setBuyAmount={setBuyAmount}
            temporaryMultiplier={temporaryMultiplier}
            stepsToday={stepsToday}
            currentLocation={currentLocation}
            generatorsHighlightId={generatorsHighlightId}
          />
          <HighlightOverlay
            highlightedElementId={highlightId}
            onDismiss={() => {}}
          />
          { showDialogueModal && <DialogueModal onPress={() => setShowDialogueModal(false)} body={dialogueText}/> }
          { onScreenPress && <Pressable style={styles.invisibleScreen} onPress={onScreenPress}/> }

          { !showDialogueModal && <StepsReward gameState={gameState} setGameState={setGameState} stepsToday={stepsToday}/> }
          { !showDialogueModal && <WorkoutReward gameState={gameState} setGameState={setGameState} currentLocation={currentLocation}/> }
        </>
      )
    case Screen.Upgrades:
      return (
        <>
          <UpgradesScreen
            setScreen={setScreen}
            gameState={gameState}
            setGameState={setGameState}
            upgradeType={upgradeType}
            setUpgradeType={setUpgradeType}
          />
          <HighlightOverlay
            highlightedElementId={highlightId}
            onDismiss={() => {}}
          />
          { showDialogueModal && <DialogueModal onPress={() => setShowDialogueModal(false)} body={dialogueText}/> }
          { onScreenPress && <Pressable style={styles.invisibleScreen} onPress={onScreenPress}/> }
        </>
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
        <>
          <TasksScreen
            setScreen={setScreen}
            gameState={gameState}
            setGameState={setGameState}
            stepsToday={stepsToday}
            currentLocation={currentLocation}
          />
          { !showDialogueModal && <StepsReward gameState={gameState} setGameState={setGameState} stepsToday={stepsToday}/> }
          { !showDialogueModal && <WorkoutReward gameState={gameState} setGameState={setGameState} currentLocation={currentLocation}/> }
        </>
      )

  }

}

const styles = StyleSheet.create({
  invisibleScreen: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
})