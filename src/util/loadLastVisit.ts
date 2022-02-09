import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStepsBetween } from '../google-fit/google-fit';
import { LastVisit } from '../../assets/data/LastVisit';

export const loadLastVisit = async (): Promise<LastVisit> => {
  // Get time of user's last visit
  const lastVisitTimeString = await AsyncStorage.getItem('lastVisitTime')
  const now = new Date()

  if (lastVisitTimeString) {
    const lastVisitTime = new Date(lastVisitTimeString)
    const lastVisitSteps = await getStepsBetween(lastVisitTime, now)
    return {
      time: lastVisitTime,
      steps: lastVisitSteps,
    }
  } else {
    // First visit
    return {
      time: now,
      steps: 0,
    }
  }
}