import * as Notifications from 'expo-notifications'
import * as BackgroundFetch from 'expo-background-fetch';
import { canReceiveWorkoutReward } from "./math/workout-reward";
import { GameState } from "../assets/data/GameState";
import { BackgroundTask } from './types/BackgroundTask';
import * as TaskManager from 'expo-task-manager';
import { AppState } from 'react-native';
import { getStepsBetween } from './google-fit/google-fit';

export const handleLocationUpdate: TaskManager.TaskManagerTaskExecutor = async ({ data: { locations }, error }) => {
  console.log(`Location Update Task: ${new Date(Date.now()).toISOString()}` );

  if (AppState.currentState == 'active') {
    return
  }

  if (error) {
    console.error(error);
    return;
  }

  const [location] = locations;
  try {
    const gameState = await GameState.load()
    const { fitnessLocation, lastWorkoutRewardTime, lastPushNotificationTime } = gameState
    if (!fitnessLocation || !fitnessLocation.isVerified) {
      return
    }

    const oneDayBefore = new Date(Date.now() - 86400000)
    if (oneDayBefore < lastPushNotificationTime) {
      return
    }

    if (canReceiveWorkoutReward(fitnessLocation, location, lastWorkoutRewardTime, new Date())) {
      return
    }

    Notifications.scheduleNotificationAsync({
      content: {
        title: "You made it to the gym!",
        body: "Claim your workout reward",
      },
      trigger: {
        seconds: 5,
      }
    }).then(() => {
      GameState.save({
        ...gameState,
        lastPushNotificationTime: new Date(),
      })
    })

  } catch (err) {
    console.error(err);
  }
  
}

export const handleStepRewardNotificationTask = async () => {  
  console.log(`Step Reward Notification Task: ${new Date(Date.now()).toISOString()}`)
  
  if (AppState.currentState == 'active') {
    return
  }

  const gameState = await GameState.load()
  const lastVisit = gameState.visitHistory.last()
  if (!lastVisit) {
    return
  }
  const now = new Date()
  const steps = await getStepsBetween(lastVisit.time, now)

  const oneDayBefore = new Date(Date.now() - 86400000)
  if (oneDayBefore < gameState.lastPushNotificationTime) {
    return
  }

  const stepsUntilNextRandomReward = gameState.stepsUntilNextRandomReward - steps
  if (stepsUntilNextRandomReward > 0) {
    return
  }

  // Between 5-6PM local time
  if (!(new Date().getHours() == 17)) {
    return
  }

  Notifications.scheduleNotificationAsync({
    content: {
      title: "You just took 5000 steps!",
      body: "You've been given a random reward",
    },
    trigger: {
      seconds: 5,
    }
  }).then(() => {
    GameState.save({
      ...gameState,
      lastPushNotificationTime: new Date(),
    })
  })


  return BackgroundFetch.BackgroundFetchResult.NewData
}

export const handleWorkoutRewardNotificationTask = async () => {
  console.log(`Workout Reward Notification Task: ${new Date(Date.now()).toISOString()}`)

  if (AppState.currentState == 'active') {
    return
  }

  const gameState = await GameState.load()

  const { fitnessLocation, lastPushNotificationTime, lastWorkoutRewardTime} = await GameState.load()
  const twoDaysBefore = new Date(Date.now() - 2 * 86400000)

  if (!fitnessLocation) {
    return
  }

  const oneDayBefore = new Date(Date.now() - 86400000)
  if (oneDayBefore < lastPushNotificationTime) {
    return
  }

  if (twoDaysBefore < lastWorkoutRewardTime) {
    return
  }

  // Between 5-6PM local time
  if (!(new Date().getHours() == 17)) {
    return
  }

  Notifications.scheduleNotificationAsync({
    content: {
      title: "Workout and get rewarded!",
      body: "Visit your fitness center today for the chance of receiving a random reward!"
    },
    trigger: {
      seconds: 5,
    }
  }).then(() => {
    GameState.save({
      ...gameState,
      lastPushNotificationTime: new Date(),
    })
  })

  return BackgroundFetch.BackgroundFetchResult.NewData
}

export const handleHighBalanceNotificationTask = async () => {
  console.log(`High Balance Notification Task: ${new Date(Date.now()).toISOString()}`)
  console.log('AppState.currentState', AppState.currentState)
  
  if (AppState.currentState == 'active') {
    return
  }
  
  const gameState = await GameState.load()

  const { lastPushNotificationTime } = await GameState.load()
  const lastVisit = gameState.visitHistory.last()
  if (!lastVisit) {
    return
  }
  const now = new Date()
  const steps = await getStepsBetween(lastVisit.time, now)
  if (steps < 10000) {
    return
  }

  const oneDayBefore = new Date(Date.now() - 86400000)
  if (oneDayBefore < lastPushNotificationTime) {
    return
  }

  // Between 5-6PM local time
  if (!(new Date().getHours() == 17)) {
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
  }).then(() => {
    GameState.save({
      ...gameState,
      lastPushNotificationTime: new Date(),
    })
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
    .then((results) => results.forEach((result) => console.log(result.status)));
}

export const registerTasks = async () => {
  console.log('registerTasks')
  const minimumInterval = 5 * 60  // seconds
  BackgroundFetch.registerTaskAsync(BackgroundTask.StepRewardNotification, {
    minimumInterval: minimumInterval,
    stopOnTerminate: false,  // android only
    startOnBoot: true,  // android only
  })
  BackgroundFetch.registerTaskAsync(BackgroundTask.WorkoutRewardNotification, {
    minimumInterval: minimumInterval,
    stopOnTerminate: false,  // android only
    startOnBoot: true,  // android only
  })
  BackgroundFetch.registerTaskAsync(BackgroundTask.HighBalanceNotification, {
    minimumInterval: minimumInterval,
    stopOnTerminate: false,  // android only
    startOnBoot: true,  // android only
  })
}