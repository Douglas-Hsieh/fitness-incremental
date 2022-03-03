import { GameState } from "../../assets/data/GameState";
import { SafeAreaView, Text, View } from "react-native";
import { DeterminateProgress } from "../components/DeterminateProgress";
import { BackgroundImage } from "../components/BackgroundImage";
import { BottomBar } from "../components/BottomBar";
import Screen from "../enums/Screen";
import colors from "../../assets/colors/colors";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import EStyleSheet from "react-native-extended-stylesheet";
import { Description } from "../components/Description";
import { memo } from "react";
import { dateToYYYYMMDDFormat } from "../math/formatting";
import { LocationObject } from "expo-location";
import { WorkoutReward } from "../components/WorkoutReward";
import { StepsReward } from "../components/StepsReward";

interface TasksScreenProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  stepsToday: number;
  currentLocation: LocationObject | undefined;
}

export const TasksScreen = ({setScreen, gameState, setGameState, stepsToday, currentLocation}: TasksScreenProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage/>
      <View style={styles.screenWrapper}>

        <Header title={'Tasks'}/>
        <Description
          title={'A mile a day keeps the doctor away'}
          body={"Keep yourself fit and healthy and we'll reward you for it"}
        />

        <StepsTask
          steps={stepsToday}
          targetSteps={6000}
        />

        <WorkoutTask setScreen={setScreen} lastWorkoutRewardTime={gameState.lastWorkoutRewardTime}/>

      </View>
      <BottomBar screen={Screen.Tasks} setScreen={setScreen}/>

      <StepsReward gameState={gameState} setGameState={setGameState} stepsToday={stepsToday}/>
      <WorkoutReward gameState={gameState} setGameState={setGameState} currentLocation={currentLocation}/>
    </SafeAreaView>
  )
}

interface StepsTaskProps {
  steps: number;
  targetSteps: number;
}

export const StepsTask = memo(({steps, targetSteps}: StepsTaskProps) => {
  const progress = steps / targetSteps <= 1
    ? steps / targetSteps
    : 1
  
  return (
    <View style={styles.taskContainer}>
      <Text style={styles.titleText}>Steps</Text>
      <Text style={styles.descriptionText}>{steps}/{targetSteps} steps today</Text>
      <View style={styles.progressBar}>
        <DeterminateProgress progress={progress}/>
      </View>
    </View>
  )
})

interface WorkoutTaskProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  lastWorkoutRewardTime: Date;
}

export const WorkoutTask = memo(({setScreen, lastWorkoutRewardTime}: WorkoutTaskProps) => {

  let progress = 0
  const hasWorkedOutToday = dateToYYYYMMDDFormat(lastWorkoutRewardTime) === dateToYYYYMMDDFormat(new Date())
  if (hasWorkedOutToday) {
    progress = 1
  }

  return (
    <View style={styles.taskContainer}>
      <Text style={styles.titleText}>Workout</Text>
      <Text style={styles.descriptionText}>{progress}/1 gym visits today</Text>
      <View style={styles.progressBar}>
        <DeterminateProgress progress={progress}/>
      </View>
      <Button text={'Workout'} onPress={() => {setScreen(Screen.Workout)}}/>
    </View>
  )
})

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
    alignItems: 'center',
  },

  taskContainer: {
    marginTop: 10,
    backgroundColor: colors.white,
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  titleText: {
    fontFamily: 'oleo-script',
    color: colors.orange3,
  },
  descriptionText: {
    marginTop: 10,
    fontSize: '1rem',
  },
  progressBar: {
    marginTop: 10,
    width: '80%',
    height: 30,
  },
  progressBarNumbers: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
  },

  milesAndCalories: {
    flexDirection: 'column',
  },

})