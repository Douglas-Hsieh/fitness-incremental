import AppleHealthKit, { HealthKitPermissions, HealthInputOptions } from 'react-native-health'
import { GetDailyStepsBetweenArgs, Steps } from './fitness-api'
import util from 'util'
import { dateToYYYYMMDDFormat } from '../math/formatting'

export const APPLE_HEALTH_AUTHORIZATION_PERMISSIONS: HealthKitPermissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.StepCount],
    write: [],
  }
}

export const getStepsBetween = async({start, end}: GetDailyStepsBetweenArgs) => {
  const options: HealthInputOptions = {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    period: 1,
  }
  const getDailyStepCountSamples = util.promisify(AppleHealthKit.getDailyStepCountSamples)

  const healthValues = await getDailyStepCountSamples(options)
  const stepsBetween = healthValues.reduce((stepsSoFar, hv) => stepsSoFar + hv.value, 0)
  return Math.round(stepsBetween)
}

export const getDailyStepsBetween = async ({start, end}: GetDailyStepsBetweenArgs): Promise<Steps[]> => {
  const startDate = new Date(start)
  const endDate = new Date(end)

  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(23,59,59,999);

  const options: HealthInputOptions = {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    period: 1440,  // (60 * 24) minutes in a day
  }
  const getDailyStepCountSamples = util.promisify(AppleHealthKit.getDailyStepCountSamples)

  const healthValues = await getDailyStepCountSamples(options)

  return healthValues.map(hv => {
    return {
      date: dateToYYYYMMDDFormat(hv.startDate),
      value: Math.round(hv.value),
    }
  })
}