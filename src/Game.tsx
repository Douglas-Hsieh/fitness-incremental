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
import { updateUser } from "./api/users";
import { signIn } from "./api/auth";
import BuyAmount from "./enums/BuyAmount";
import { calculateTicksToUse, calculateTicksUsedSinceLastProgress, hasWorkingGenerator, progressGenerators } from "./math/revenue";
import { TICKS_PER_STEP } from "../assets/data/Constants";
import { AppState, AppStateStatus, Pressable, StyleSheet } from "react-native";
import { StepProgress } from "../assets/data/StepProgress";
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
import { getSignInAuthCredentials, SignInAuth } from "./types/SignInAuth";
import { FitnessLocation } from "./shared/fitness-locations.interface";
import { upsertSavedGame } from "./api/saved-games";
import { DEFAULT_LAST_VISIT_STATS, LastVisitStats } from "./types/LastVisitStats";

interface GameProps {
  screen: Screen;
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  fitnessLocation: FitnessLocation | null;
  setFitnessLocation: React.Dispatch<React.SetStateAction<FitnessLocation>>;
  signInAuth: SignInAuth;
}

export const Game = ({ screen, setScreen, gameState, setGameState, fitnessLocation, setFitnessLocation, signInAuth}: GameProps) => {

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [hasForegroundLocationPermission, setHasForegroundLocationPermission] = useState<boolean>()
  const [currentLocation, setCurrentLocation] = useState<LocationObject>();
  const [buyAmount, setBuyAmount] = useState<BuyAmount>(BuyAmount.One);
  const [upgradeType, setUpgradeType] = useState<UpgradeType>(UpgradeType.GeneratorMultiplierCashUpgrade)
  const [temporaryMultiplier, setTemporaryMultiplier] = useState<number>(1);

  const [stepsToday, setStepsToday] = useState<number>(0)
  const [showDialogueModal, setShowDialogueModal] = useState<boolean>(false)
  const [dialogueText, setDialogueText] = useState<string>('')
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [generatorsHighlightId, setGeneratorsHighlightId] = useState<string | null>(null)
  const [onScreenPress, setOnScreenPress] = useState<(() => void) | null>(null)
  const [lastVisitStats, setLastVisitStats] = useState<LastVisitStats>(DEFAULT_LAST_VISIT_STATS);


  /** Login to server */
  useEffect(() => {
    if (isLoggedIn || !signInAuth) {
      return
    }

    let creds;
    try {
      creds = getSignInAuthCredentials(signInAuth);
    } catch (error) {
      console.error(error);
      return
    }

    if (!creds.idToken) {
      console.log('Cannot login because idToken is empty')
      return
    }

    signIn(creds)
      .then(user => {
        setGameState(prevGameState => ({ ...prevGameState, user: user, }))
        setIsLoggedIn(true)
      })
  }, [isLoggedIn, signInAuth])

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    // If user has no fitness location saved, ask api if one exists
    if (!fitnessLocation) {
      getFitnessLocations()
        .then(fitnessLocations => {
          const myFitnessLocations = fitnessLocations.filter(fitnessLocation => fitnessLocation.userId === gameState.user!.id)
          if (myFitnessLocations.length <= 0) {
            return;
          }
          setFitnessLocation(myFitnessLocations[0])
        })
    }

    // Register for push notifications
    registerForPushNotificationsAsync()
      .then(token => {
        if (token) {
          updateUser({ id: gameState.user!.id, expoPushToken: token })
        }
      })
  }, [isLoggedIn])

  useEffect(() => {
    if (!fitnessLocation) {
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
  }, [fitnessLocation, hasForegroundLocationPermission])

  
  function handleProgress() {
    handleRevenueProgress()
    handleStepProgress(false)
  }

  function handleRevenueProgress() {
    setGameState(prevGameState => {
      if (!hasWorkingGenerator(prevGameState)) {
        return prevGameState
      }

      const now = new Date()
      const ticksUsed = calculateTicksUsedSinceLastProgress(now, prevGameState)
      const {generatorStateById, revenue} = progressGenerators(prevGameState, ticksUsed)
      console.log(`Since last progress - Ticks used: ${ticksUsed}, Revenue: ${revenue}`)

      setLastVisitStats(prevStats => ({
        ...prevStats,
        revenue: revenue,
        ticksUsed: ticksUsed,
      }))

      return {
        ...prevGameState,
        ticks: prevGameState.ticks - ticksUsed,
        generatorStateById: generatorStateById,
        balance: prevGameState.balance + revenue,
        sessionEarnings: prevGameState.sessionEarnings + revenue,
        lastRevenueProgress: now,
      }
    })
  }

  /**
   * 
   * @param isForeground Whether or not progress was made while app was in foreground
   * @returns 
   */
  function handleStepProgress(isForeground: boolean) {
    setGameState(prevGameState => {
      // Hacky solution required to use previous game state and getStepsBetween together
      setGameStepProgress(prevGameState, isForeground)
      return prevGameState
    })
  }
  async function setGameStepProgress(prevGameState: GameState, isForeground: boolean) {
    const { stepProgressHistory } = prevGameState
    const stepProgress = stepProgressHistory.last()

    const isFirstVisit = !stepProgress
    if (isFirstVisit) {
      setGameState({
        ...prevGameState,
        stepProgressHistory: stepProgressHistory.push(new StepProgress())
      })
      return
    }

    const now = new Date()
    const steps = await getStepsBetween({start: stepProgress.time, end: now})
    const ticksEarned = TICKS_PER_STEP * steps

    setGameState({
      ...prevGameState,
      ticks: prevGameState.ticks + ticksEarned,
      stepProgressHistory: prevGameState.stepProgressHistory.push(new StepProgress(now, steps, isForeground)),
    })

    if (!isForeground) {
      setLastVisitStats(prevStats => ({
        ...prevStats,
        steps: steps,
        ticks: ticksEarned,
      }))
    }
  }

  useEffect(() => {
    // Handle progress since app termination
    handleProgress()
    getStepsToday().then(setStepsToday)
  }, [])

  // Handle background progress
  function handleAppStateChange (nextAppState: AppStateStatus) {
    if (nextAppState === 'active') {
      console.log('App entered foreground from background')
      handleProgress()
    }
  }
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)
    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])

  // Handle foreground revenue progress
  useInterval(() => {
    // // Dangerous: can stop the game loop
    // if (showDialogueModal) {
    //   return
    // }

    if (!hasWorkingGenerator(gameState)) {
      return
    }

    // Generators progress and generate revenue using ticks
    setGameState(prevGameState => {
      const ticksToUse = calculateTicksToUse(gameState.ticks, gameState.speed)
      if (ticksToUse <= 0) return prevGameState;
      const {generatorStateById, revenue} = progressGenerators(gameState, ticksToUse)
      const now = new Date()

      return {
        ...prevGameState,
        ticks: prevGameState.ticks - ticksToUse,
        generatorStateById: generatorStateById,
        balance: prevGameState.balance + revenue,
        sessionEarnings: prevGameState.sessionEarnings + revenue,
        lastRevenueProgress: now,
      }
    })

    // console.log(`Ticks used: ${ticksToUse}, Revenue: ${revenue}`)
  }, 1000)

  useInterval(() => {
    const temporaryMultiplier = calculateTemporaryMultipliers(gameState.temporaryMultipliers)
    setTemporaryMultiplier(temporaryMultiplier)
  }, 1000)

  useEffect(() => {
    try {
      const creds = getSignInAuthCredentials(signInAuth);
      upsertSavedGame(creds.idToken, gameState);
    } catch (error) {
      console.error(error);
    }
  }, [])

  useInterval(() => {
    // Handle foreground step progress
    handleStepProgress(true)
    getStepsToday().then(setStepsToday)

    try {
      const creds = getSignInAuthCredentials(signInAuth);
      upsertSavedGame(creds.idToken, gameState);
    } catch (error) {
      console.error(error);
    }
  }, 60 * 1000)

  useEffect(() => {
    if (screen !== Screen.WelcomeBack && screen !== Screen.Workout) {
      setScreen(Screen.WelcomeBack)
    }
  }, [lastVisitStats])

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
    if (gameState.upgradeState.managerUpgradeIds.contains(getUpgradeId(MANAGER_UPGRADES[0]))) {
      completeTutorial('firstGenerator1')
      completeTutorial('firstGenerator2')
      completeTutorial('firstGenerator3')
      completeTutorial('manager1')
      completeTutorial('manager2')
      completeTutorial('manager3')
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
          lastVisitStats={lastVisitStats}
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
          { !showDialogueModal && <WorkoutReward gameState={gameState} setGameState={setGameState} fitnessLocation={fitnessLocation} currentLocation={currentLocation}/> }
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
          gameState={gameState}
          setGameState={setGameState}
          fitnessLocation={fitnessLocation}
        />
      )
    case Screen.Workout:
      return (
        <WorkoutScreen
          setScreen={setScreen}
          gameState={gameState}
          fitnessLocation={fitnessLocation}
          setFitnessLocation={setFitnessLocation}
        />
      )
    case Screen.FitnessLocationAdmin:
      return (
        <FitnessLocationAdminScreen
          setScreen={setScreen}
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
          { !showDialogueModal && <WorkoutReward gameState={gameState} setGameState={setGameState} fitnessLocation={fitnessLocation} currentLocation={currentLocation}/> }
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