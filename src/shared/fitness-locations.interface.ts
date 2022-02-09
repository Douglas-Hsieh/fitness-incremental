export interface FitnessLocation {
  id: number;
  userId: number;
  imageUri: string;
  coordinates: number[];
  isVerified: boolean | null;
}

export const toLatLng = (fitnessLocation: FitnessLocation) => {
  return {
    longitude: fitnessLocation.coordinates[0],
    latitude: fitnessLocation.coordinates[1],
  }
}