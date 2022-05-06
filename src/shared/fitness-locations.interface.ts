import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FitnessLocation {
  id: number;
  userId: number;
  imageUri: string;
  coordinates: number[];
  isVerified: boolean | null;
}

export async function loadFitnessLocation() {
  const fitnessLocationString = await AsyncStorage.getItem('fitnessLocation')
  const fitnessLocation: FitnessLocation | null = fitnessLocationString ? JSON.parse(fitnessLocationString) : null;
  return fitnessLocation;
}

export async function saveFitnessLocation(fitnessLocation: FitnessLocation) {
  AsyncStorage.setItem('fitnessLocation', JSON.stringify(fitnessLocation))
}

export const toLatLng = (fitnessLocation: FitnessLocation) => {
  return {
    longitude: fitnessLocation.coordinates[0],
    latitude: fitnessLocation.coordinates[1],
  }
}