import * as Notifications from 'expo-notifications'
import * as BackgroundFetch from 'expo-background-fetch';
import { GameState } from "../assets/data/GameState";
import { BackgroundTask } from './types/BackgroundTask';
import * as TaskManager from 'expo-task-manager';
import { AppState } from 'react-native';
import { calculateStepRewardsLeft, canReceiveWorkoutReward } from './rewards';
import { getStepsBetween } from './fitness-api/fitness-api';
import allSettled from 'promise.allsettled';
import { dateToYYYYMMDDFormat } from './math/formatting';
import { loadFitnessLocation } from './shared/fitness-locations.interface';
import { LocationObject } from 'expo-location';

interface LocationData {
  locations: LocationObject[];
}

export const handleLocationUpdate: TaskManager.TaskManagerTaskExecutor = async ({ data, error }: TaskManager.TaskManagerTaskBody<LocationData>) => {
  if (AppState.currentState == 'active') {
    console.log(`Location Update Task: ${new Date(Date.now()).toISOString()}` );
    return
  }

  const [location] = data.locations;
  const { longitude, latitude } = location.coords;

  // for testing
  console.log(`Background Location Update Task: ${new Date(Date.now()).toISOString()}, Location: [${longitude}, ${latitude}]`)
  // Notifications.scheduleNotificationAsync({
  //   content: {
  //     title: "Background Location Update Task",
  //     body: `Location: [${longitude}, ${latitude}]`
  //   },
  //   trigger: {
  //     seconds: 5,
  //   }
  // })

  if (error) {
    console.error(error);
    return;
  }

  try {
    const gameState = await GameState.load()
    const fitnessLocation = await loadFitnessLocation()

    const { lastWorkoutRewardTime, lastPushNotificationTime } = gameState
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
  if (AppState.currentState == 'active') {
    console.log(`Step Reward Notification Task: ${new Date(Date.now()).toISOString()}`)
    return
  }

  // for testing
  console.log(`Background Step Reward Notification Task: ${new Date(Date.now()).toISOString()}`)
  // Notifications.scheduleNotificationAsync({
  //   content: {
  //     title: 'Background Step Reward Notification Task',
  //   },
  //   trigger: {
  //     seconds: 5,
  //   }
  // })

  const gameState = await GameState.load()
  const lastVisit = gameState.stepProgressHistory.last()
  if (!lastVisit) {
    return
  }

  const oneDayBefore = new Date(Date.now() - 86400000)
  if (oneDayBefore < gameState.lastPushNotificationTime) {
    return
  }

  const today = dateToYYYYMMDDFormat(new Date())
  const fitnessRewards = gameState.fitnessRewardsByDate.get(today)
  if (!fitnessRewards) {
    return
  }

  const stepRewardsLeft = calculateStepRewardsLeft(fitnessRewards.steps, fitnessRewards.stepRewards)
  if (stepRewardsLeft <= 0) {
    return
  }

  // Between 5-6PM local time
  if (!(new Date().getHours() == 17)) {
    return
  }

  let title: string, body: string
  if (stepRewardsLeft > 1) {
    title = 'Fitness Rewards'
    body = `You have ${stepRewardsLeft} unopened fitness boxes`
  } else {
    title = 'Fitness Reward'
    body = `You have 1 unopened fitness box`
  }

  Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
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
  if (AppState.currentState == 'active') {
    console.log(`Workout Reward Notification Task: ${new Date(Date.now()).toISOString()}`)
    return
  }

  console.log(`Background Reward Notification Task: ${new Date(Date.now()).toISOString()}`)

  const gameState = await GameState.load()
  const fitnessLocation = await loadFitnessLocation()

  const { lastPushNotificationTime, lastWorkoutRewardTime} = gameState
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
  if (AppState.currentState == 'active') {
    console.log(`High Balance Notification Task: ${new Date(Date.now()).toISOString()}`)
    return
  }

  console.log(`Background High Balance Notification Task: ${new Date(Date.now()).toISOString()}`)

  const gameState = await GameState.load()

  const { lastPushNotificationTime } = await GameState.load()
  const lastVisit = gameState.stepProgressHistory.last()
  if (!lastVisit) {
    return
  }
  const now = new Date()
  const steps = await getStepsBetween({start: lastVisit.time, end: now})
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
  await allSettled([
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