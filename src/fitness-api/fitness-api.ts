import { Platform } from "react-native"
import * as GF from './google-fit';
import * as AH from './apple-health-kit'

export interface Steps {
  date: string;
  value: number;
}

export interface GetDailyStepsBetweenArgs {
  start: Date;
  end: Date;
}

export const getStepsBetween = async({start, end}: GetDailyStepsBetweenArgs) => {
  if (Platform.OS === 'android') {
    return GF.getStepsBetween({start, end})
  } else if (Platform.OS === 'ios') {
    return AH.getStepsBetween({start, end})
  }
  return Promise.reject('Invalid platform')
}

export const getDailyStepsBetween = async ({start, end}: GetDailyStepsBetweenArgs) => {
  if (Platform.OS === 'android') {
    return GF.getDailyStepsBetween({start, end})
  } else if (Platform.OS === 'ios') {
    return AH.getDailyStepsBetween({start, end})
  }
  return Promise.reject('Invalid platform')
}

export function getStepsToday() {
  const today = new Date()
  return getDailyStepsBetween({start: today, end: today})
    .then(dailySteps => {
      return dailySteps.length > 0
        ? dailySteps[0].value
        : 0
    })
}