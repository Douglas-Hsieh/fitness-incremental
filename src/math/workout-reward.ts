import { LocationObject } from "expo-location";
import haversine from "haversine";
import { FitnessLocation, toLatLng } from "../shared/fitness-locations.interface"

export const canReceiveWorkoutReward = (fitnessLocation: FitnessLocation, currentLocation: LocationObject, lastWorkoutRewardTime: Date, currentTime: Date) => {
  const fitnessLocationLatLng = toLatLng(fitnessLocation);
  const isNearFitnessLocation = haversine(fitnessLocationLatLng, currentLocation.coords, { unit: 'mile', threshold: 0.1})

  const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000
  const diffTime = Math.abs(currentTime.getTime() - lastWorkoutRewardTime.getTime())
  const enoughTimeSinceLastReward = diffTime > EIGHT_HOURS_MS

  return isNearFitnessLocation && enoughTimeSinceLastReward
}