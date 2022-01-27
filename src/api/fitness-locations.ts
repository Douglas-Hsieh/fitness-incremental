import { FitnessLocation } from "../../../fitness-incremental-shared/src/fitness-location.interface"
import { SERVER_URL } from "../config"

export const endpoint = `${SERVER_URL}/fitness-locations`

export const getFitnessLocation = async (userId: string) => {
  return fetch(`${endpoint}/${userId}`)
}

export const upsertFitnessLocation = async (fitnessLocation: Partial<FitnessLocation>) => {
  return fetch(`${endpoint}/${fitnessLocation.userId}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: fitnessLocation.userId,
      imageUri: fitnessLocation.imageUri,
      coordinates: fitnessLocation.coordinates,
      isVerified: fitnessLocation.isVerified,
    }),
  })
}

export const getAllUnverifiedFitnessLocations = async () => {
  return fetch(`${SERVER_URL}/fitness-locations/isVerified/null`)
}