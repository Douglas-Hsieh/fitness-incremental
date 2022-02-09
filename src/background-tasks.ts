import * as Notifications from 'expo-notifications'
import * as BackgroundFetch from 'expo-background-fetch';
import { loadLastVisit } from "./util/loadLastVisit";
import { canReceiveWorkoutReward } from "./math/workout-reward";
import { GameState } from "../assets/data/GameState";
import { BackgroundTask } from './types/BackgroundTask';
import * as TaskManager from 'expo-task-manager';

export const handleLocationUpdate = async ({ data: { locations }, error }) => {
  if (error) {
    console.error(error);
    return;
  }

  const [location] = locations;
  try {
    console.log(`Location Update Task: ${new Date(Date.now()).toISOString()}` );

    const gameState = await GameState.load()
    const { fitnessLocation, lastWorkoutRewardTime } = gameState
    if (!fitnessLocation || !fitnessLocation.isVerified) {
      return
    }

    if (canReceiveWorkoutReward(fitnessLocation, location, lastWorkoutRewardTime, new Date())) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "You made it to the gym!",
          body: "Claim your workout reward",
        },
        trigger: {
          seconds: 5,
        }
      })
    }

  } catch (err) {
    console.error(err);
  }
  
}

export const handleStepRewardNotificationTask = async () => {
  console.log(`Step Reward Notification Task: ${new Date(Date.now()).toISOString()}`)

  const gameState = await GameState.load()
  const lastVisit = await loadLastVisit()
  
  const stepsUntilNextRandomReward = gameState.stepsUntilNextRandomReward - lastVisit.steps
  if (stepsUntilNextRandomReward <= 0) {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "You just took 5000 steps!",
        body: "You've been given a random reward",
      },
      trigger: {
        seconds: 5,
      }
    })
  }

  return BackgroundFetch.BackgroundFetchResult.NewData
}

export const handleWorkoutRewardNotificationTask = async () => {
  console.log(`Workout Reward Notification Task: ${new Date(Date.now()).toISOString()}`)

  const gameState = await GameState.load()
  const twoDaysBefore = new Date(Date.now() - 2 * 86400000)

  if (!gameState.fitnessLocation) {
    return
  }

  if (gameState.lastWorkoutRewardTime < twoDaysBefore) {
    // More than 48 hours since visiting fitness location
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Workout and get rewarded!",
        body: "Visit your fitness center today for the chance of receiving a random reward!"
      },
      trigger: {
        seconds: 5,
      }
    })
  }

  return BackgroundFetch.BackgroundFetchResult.NewData
}

export const handleHighBalanceNotificationTask = async () => {
  console.log(`High Balance Notification Task: ${new Date(Date.now()).toISOString()}`)

  const lastVisit = await loadLastVisit()
  if (lastVisit.steps < 10000) {
    return
  }

  Notifications.scheduleNotificationAsync({
    content: {
      title: "Unspent steps",
      body: "Your followers have taken many steps ready for you spend!",
    },
    trigger: {
      seconds: 5,
    }
  })

  return BackgroundFetch.BackgroundFetchResult.NewData
}

TaskManager.defineTask(BackgroundTask.LocationUpdate, handleLocationUpdate)
TaskManager.defineTask(BackgroundTask.StepRewardNotification, handleStepRewardNotificationTask)
TaskManager.defineTask(BackgroundTask.WorkoutRewardNotification, handleWorkoutRewardNotificationTask)
TaskManager.defineTask(BackgroundTask.HighBalanceNotification, handleHighBalanceNotificationTask)

export const unregisterTasks = async () => {
  await Promise.allSettled([
    BackgroundFetch.unregisterTaskAsync(BackgroundTask.StepRewardNotification),
    BackgroundFetch.unregisterTaskAsync(BackgroundTask.WorkoutRewardNotification),
    BackgroundFetch.unregisterTaskAsync(BackgroundTask.HighBalanceNotification),
  ])
}

export const registerTasks = async () => {
  console.log('registerTasks')
  BackgroundFetch.registerTaskAsync(BackgroundTask.StepRewardNotification, {
    minimumInterval: 5,  // seconds
    stopOnTerminate: false,  // android only
    startOnBoot: true,  // android only
  })
  BackgroundFetch.registerTaskAsync(BackgroundTask.WorkoutRewardNotification, {
    minimumInterval: 5,  // seconds
    stopOnTerminate: false,  // android only
    startOnBoot: true,  // android only
  })
  BackgroundFetch.registerTaskAsync(BackgroundTask.HighBalanceNotification, {
    minimumInterval: 5,  // seconds
    stopOnTerminate: false,  // android only
    startOnBoot: true,  // android only
  })
}