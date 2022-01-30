import { FitnessLocation } from "../../../fitness-incremental-shared/src/fitness-locations.interface"
import { SERVER_URL } from "../config"

export const endpoint = `${SERVER_URL}/fitness-locations`

export const getFitnessLocations = async (): Promise<FitnessLocation[]> => {
  return fetch(`${endpoint}`)
    .then(res => res.json())
    .then(res => res.data)
}

export const getAllUnverifiedFitnessLocations = async () => {
  return fetch(`${SERVER_URL}/fitness-locations/isVerified/null`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Are you an admin?')
      }
      return res.json()
    })
    .then(res => res.data)
}

export const createFitnessLocation = async (fitnessLocation: Partial<FitnessLocation>): Promise<FitnessLocation> => {
  return fetch(`${endpoint}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageUri: fitnessLocation.imageUri,
      coordinates: fitnessLocation.coordinates,
      isVerified: fitnessLocation.isVerified,
    }),
  })
    .then(res => res.json())
    .then(res => res.data)
}

export const updateFitnessLocation = async (fitnessLocation: Partial<FitnessLocation>): Promise<FitnessLocation> => {
  console.log('fitnessLocation', Object.keys(fitnessLocation))
  return fetch(`${endpoint}/${fitnessLocation.id}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageUri: fitnessLocation.imageUri,
      coordinates: fitnessLocation.coordinates,
      isVerified: fitnessLocation.isVerified,
    }),
  })
    .then(res => res.json())
    .then(res => res.data)
}
