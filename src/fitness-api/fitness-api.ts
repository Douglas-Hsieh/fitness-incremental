import { Platform } from "react-native"
import GoogleFit from "react-native-google-fit";
import { GOOGLE_FIT_AUTHORIZATION_OPTIONS } from "./google-fit";
import AppleHealthKit from 'react-native-health'
import { APPLE_HEALTH_AUTHORIZATION_PERMISSIONS } from "./apple-health-kit";
import * as GF from './google-fit';
import * as AH from './apple-health-kit'

export const requestAuthorization = () => {
  if (Platform.OS === 'android') {
    return GoogleFit.authorize(GOOGLE_FIT_AUTHORIZATION_OPTIONS)
  } else if (Platform.OS === 'ios') {
    return AppleHealthKit.initHealthKit(APPLE_HEALTH_AUTHORIZATION_PERMISSIONS, (error) => {
      if (error) {
        throw error
      }
    })
  }
}

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