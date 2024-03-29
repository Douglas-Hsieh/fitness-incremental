import { GameState } from "../../assets/data/GameState";
import { Image, SafeAreaView, Text, View } from "react-native";
import { DeterminateProgress } from "../components/DeterminateProgress";
import { Background } from "../components/BackgroundImage";
import { BottomBar } from "../components/BottomBar";
import Screen from "../enums/Screen";
import colors from "../../assets/colors/colors";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import EStyleSheet from "react-native-extended-stylesheet";
import { Description } from "../components/Description";
import React, { memo, useState } from "react";
import { dateToYYYYMMDDFormat } from "../math/formatting";
import { LocationObject } from "expo-location";
import { STEP_REWARDS } from "../../assets/data/Constants";
import { ScrollView } from "react-native-gesture-handler";
import { calculateStepRewardsLeftToday, calculateCanReceiveWorkoutReward, FitnessReward } from "../rewards";
import { Map } from "immutable";
import { StepsReward } from "../components/StepsReward";
import { WorkoutReward } from "../components/WorkoutReward";
import { FitnessLocation } from "../shared/fitness-locations.interface";
import { FlashingButton } from "../components/FlashingButton";

const RewardImage = memo(() => (
  <Image source={require('../../assets/images/present.png')} style={styles.rewardIcon}/>
));

interface TasksScreenProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  stepsToday: number;
  currentLocation: LocationObject | undefined;
  fitnessLocation: FitnessLocation | null;
}

export const TasksScreen = ({setScreen, gameState, setGameState, stepsToday, currentLocation, fitnessLocation}: TasksScreenProps) => {
  const [isClaimingStepsReward, setIsClaimingStepsReward] = useState<boolean>(false)
  const [isClaimingWorkoutReward, setIsClaimingWorkoutReward] = useState<boolean>(false)

  let canReceiveWorkoutReward
  if (!fitnessLocation || !currentLocation) {
    canReceiveWorkoutReward = false
  } else {
    canReceiveWorkoutReward = calculateCanReceiveWorkoutReward(fitnessLocation, currentLocation, gameState.lastWorkoutRewardTime, new Date())
  }

  return (
    <SafeAreaView style={styles.container}>
      <Background/>
      <View style={styles.screenWrapper}>

        <Header title={'Tasks'}/>
        <Description
          title={'Pain today becomes strength tomorrow'}
          body={"Get rewarded for becoming an athlete"}
        />
        <View style={{width: '100%', height: 10}}/>
        <ScrollView
          style={styles.scroll}
          contentInsetAdjustmentBehavior='automatic'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <StepsTask
            fitnessRewardsByDate={gameState.fitnessRewardsByDate}
            steps={stepsToday}
            setIsClaimingStepsReward={setIsClaimingStepsReward}
          />
          <WorkoutTask
            setScreen={setScreen}
            lastWorkoutRewardTime={gameState.lastWorkoutRewardTime}
            setIsClaimingWorkoutReward={setIsClaimingWorkoutReward}
            canReceiveWorkoutReward={canReceiveWorkoutReward}
          />

         <View style={{width: '100%', height: 10}}/>
        </ScrollView>

      </View>
      <BottomBar screen={Screen.Tasks} setScreen={setScreen}/>

      { isClaimingStepsReward && <StepsReward gameState={gameState} setGameState={setGameState} stepsToday={stepsToday}/>}
      { isClaimingWorkoutReward && <WorkoutReward gameState={gameState} setGameState={setGameState} fitnessLocation={fitnessLocation} currentLocation={currentLocation}/> }
    </SafeAreaView>
  )
}

interface StepsTaskProps {
  fitnessRewardsByDate: Map<string, FitnessReward>;
  steps: number;
  setIsClaimingStepsReward: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StepsTask = memo(({fitnessRewardsByDate, steps, setIsClaimingStepsReward}: StepsTaskProps) => {
  const targetSteps = STEP_REWARDS
    .filter(stepReward => steps < stepReward.steps)
    .map(stepReward => stepReward.steps)
    .min()

  let descriptionText
  let progress
  let progressBarText
  if (targetSteps) {
    descriptionText = `${targetSteps - steps} steps until next reward`
    progress = steps / targetSteps <= 1
      ? steps / targetSteps
      : 1
    progressBarText = `${steps} / ${targetSteps}`
  } else {
    descriptionText = `Congrats, you've completed all step tasks today`
    progress = 1

    const highestRewardSteps = STEP_REWARDS.map(stepReward => stepReward.steps).max()
    progressBarText = `${steps} / ${highestRewardSteps}`
  }
  const rewardsLeft = calculateStepRewardsLeftToday(fitnessRewardsByDate)
  const rewardImages = rewardsLeft > 0
    ? new Array(rewardsLeft).fill(<RewardImage/>)
    : new Array()

  return (
    <View style={styles.taskContainer}>
      <Text style={styles.titleText}>Steps Today</Text>
      <Text style={styles.descriptionText}>{descriptionText}</Text>
      <View style={styles.progressBar}>
        <DeterminateProgress progress={progress}/>
        <Text style={styles.progressBarText}>{progressBarText}</Text>
      </View>
      { targetSteps && <>
        <Text style={styles.rewardText}>Reward: 1 Fitness Box</Text>
        <RewardImage/>
      </>
      }

      { rewardsLeft > 0 &&
        <>
          <Text style={styles.rewardText}>Unopened rewards</Text>
          <View style={styles.rewardLine}>
            {rewardImages}
          </View>
          <FlashingButton text={'Claim'} onPress={() => setIsClaimingStepsReward(true)} style={styles.button}/>
        </>
      }
    </View>
  )
})

interface WorkoutTaskProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  lastWorkoutRewardTime: Date;
  setIsClaimingWorkoutReward: React.Dispatch<React.SetStateAction<boolean>>;
  canReceiveWorkoutReward: boolean;
}

export const WorkoutTask = memo(({setScreen, lastWorkoutRewardTime, setIsClaimingWorkoutReward, canReceiveWorkoutReward}: WorkoutTaskProps) => {
  const hasWorkedOutToday = dateToYYYYMMDDFormat(lastWorkoutRewardTime) === dateToYYYYMMDDFormat(new Date())
  const progress = hasWorkedOutToday ? 1 : 0
  const descriptionText = hasWorkedOutToday
    ? `Great job making it to the gym!`
    : `Visit the gym today to claim`
  const progressBarText = `${progress} / 1`

  return (
    <View style={styles.taskContainer}>
      <Text style={styles.titleText}>Workout</Text>
      <Text style={styles.descriptionText}>{descriptionText}</Text>
      <View style={styles.progressBar}>
        <DeterminateProgress progress={progress}/>
        <Text style={styles.progressBarText}>{progressBarText}</Text>
      </View>
      { !hasWorkedOutToday && <>
          <Text style={styles.rewardText}>Reward: 2 Fitness Boxes</Text>
          <View style={styles.rewardLine}>
            <RewardImage/>
            <RewardImage/>
          </View>
        </>
      }

      { canReceiveWorkoutReward &&
        <>
          <FlashingButton text={'Claim'} onPress={() => setIsClaimingWorkoutReward(true)} style={styles.button}/>
        </>
      }
      { !canReceiveWorkoutReward &&
        <Button text={'Workout'} onPress={() => {setScreen(Screen.Workout)}} style={styles.button}/>
      }

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
  scroll: {
    width: '100%',
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },

  taskContainer: {
    marginTop: 10,
    backgroundColor: colors.white,
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
    padding: 10,
  },
  titleText: {
    fontFamily: 'oleo-script',
    fontSize: '1.1rem',
    color: colors.orange3,
  },
  descriptionText: {
    marginTop: 10,
    fontSize: '1rem',
    textAlign: 'center',
  },
  rewardLine: {
    flexDirection: 'row',
  },
  rewardText: {
    fontFamily: 'oleo-script',
    fontSize: '1.1rem',
    marginVertical: 10,
  },
  rewardIcon: {
    width: 32,
    height: 32,
  },
  progressBar: {
    marginTop: 10,
    width: '90%',
    height: 40,
  },
  progressBarText: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: '1.1rem',
  },
  button: {
    marginTop: 10,
  },
})