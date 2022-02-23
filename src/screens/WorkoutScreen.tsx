import React, { useEffect, useRef, useState } from "react";
import { GestureResponderEvent, Image, SafeAreaView, StyleSheet, View } from "react-native";
import { GameState } from "../../assets/data/GameState";
import { BackgroundImage } from "../components/BackgroundImage";
import { BottomBar } from "../components/BottomBar";
import { Button } from "../components/Button";
import { Description } from "../components/Description";
import { Header } from "../components/Header";
import Screen from "../enums/Screen";
import { Camera } from 'expo-camera';
import { window } from '../util/Window'
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, LocationObject, requestBackgroundPermissionsAsync, startLocationUpdatesAsync, Accuracy, stopLocationUpdatesAsync } from 'expo-location'
import { Feather } from "@expo/vector-icons";
import Center from "../components/Center";
import colors from "../../assets/colors/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { manipulateAsync } from 'expo-image-manipulator'
import { WorkoutReward } from "../components/WorkoutReward";
import { createFitnessLocation, getFitnessLocations, updateFitnessLocation } from "../api/fitness-locations";
import { FitnessLocation } from "../shared/fitness-locations.interface";
import { BackgroundTask } from "../types/BackgroundTask";

const base64ToImageUri = (base64: string) => {
  return 'data:image/jpeg;base64,' + base64
}

export interface PhotoAndLocation {
  compressedImageUri: string;
  imageUri: string;
  location: LocationObject;
}

interface ExitCameraIconProps {
  onPress?: (((event: GestureResponderEvent) => void) & (() => void)) | undefined
}

const ExitCameraIcon = ({onPress}: ExitCameraIconProps) => (
  <View style={styles.xIconWrapper}>
    <TouchableOpacity onPress={onPress}>
      <Feather name={'x'} size={window.width / 10} color={'white'}/>
    </TouchableOpacity>
  </View>
)

interface WorkoutScreenProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  currentLocation: LocationObject | undefined;
}

export const WorkoutScreen = ({setScreen, gameState, setGameState, currentLocation}: WorkoutScreenProps) => {
  const { fitnessLocation, lastWorkoutRewardTime } = gameState
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>();
  const cameraRef = useRef<Camera | null>()
  const [hasForegroundLocationPermission, setHasForegroundLocationPermission] = useState<boolean>();
  const [hasBackgroundLocationPermission, setHasBackgroundLocationPermission] = useState<boolean>(true);

  const [isTakingPicture, setIsTakingPicture] = useState<boolean>(false);
  const [photoAndLocation, setPhotoAndLocation] = useState<PhotoAndLocation>();

  const requestAndSetCameraPermission = async () => {
    const cameraResponse = await Camera.requestCameraPermissionsAsync()
    setHasCameraPermission(cameraResponse.status === 'granted')
  }

  const requestAndSetForegroundLocationPermission = async () => {
    const foregroundResponse = await requestForegroundPermissionsAsync()
    setHasForegroundLocationPermission(foregroundResponse.status === 'granted')
  }

  const requestAndSetBackgroundLocationPermission = async () => {
    const backgroundResponse = await requestBackgroundPermissionsAsync()
    setHasBackgroundLocationPermission(backgroundResponse.status === 'granted')
  }

  const requestPermissions = (async () => {
    await requestAndSetCameraPermission()
    await requestAndSetForegroundLocationPermission()
    await requestAndSetBackgroundLocationPermission()
  })

  const takePicture = () => {
    requestPermissions()
    setIsTakingPicture(true)
  }

  const snap = async () => {
    if (cameraRef.current) {
      const camera = cameraRef.current
      const image = await camera.takePictureAsync({
        base64: true,
      })
      const location = await getCurrentPositionAsync()

      // Compress photo
      const compressedImage = await manipulateAsync(base64ToImageUri(image.base64!), [], { base64: true, compress: 0 });

      setPhotoAndLocation({
        imageUri: base64ToImageUri(image.base64!),
        compressedImageUri: base64ToImageUri(compressedImage.base64!),
        location: location,
      })
    }
  }

  const getAndSetFitnessLocation = async () => {
    getFitnessLocations()
      .then(fitnessLocations => {
        const myFitnessLocations = fitnessLocations.filter(fitnessLocation => fitnessLocation.userId === gameState.user!.id)
        if (myFitnessLocations.length > 0)
        setGameState(prevGameState => ({ ...prevGameState, fitnessLocation: myFitnessLocations[0], })
      )})
      .catch(error => {
        alert(error)
      })
  }

  const sendForVerification = async () => {
    if (!photoAndLocation) {
      return
    }

    const {longitude, latitude} = photoAndLocation.location.coords
    const fitnessLocation: Partial<FitnessLocation> = {
      coordinates: [longitude, latitude],
      imageUri: photoAndLocation.compressedImageUri,
      isVerified: null,
    }

    if (gameState.fitnessLocation) {
      updateFitnessLocation({
        id: gameState.fitnessLocation.id,
        ...fitnessLocation,
      })
        .then(getAndSetFitnessLocation)
        .catch(error => {
          alert(error)
        })
    } else {
      createFitnessLocation(fitnessLocation)
        .then(getAndSetFitnessLocation)
        .catch(error => {
          alert(error)
        })
    }


    setIsTakingPicture(false)
  }

  const handleExitCamera = () => {
    setIsTakingPicture(false)
    setPhotoAndLocation(undefined)
  }

  useEffect(() => {
    getAndSetFitnessLocation()
  }, [])

  useEffect(() => {
    console.log('hasBackgroundLocationPermission', hasBackgroundLocationPermission)
    if (hasBackgroundLocationPermission) {
      (async () => {
        await stopLocationUpdatesAsync(BackgroundTask.LocationUpdate)
        await startLocationUpdatesAsync(BackgroundTask.LocationUpdate, {
          accuracy: Accuracy.Lowest,
          foregroundService: {
            notificationTitle: 'GPS',
            notificationBody: 'enabled',
            notificationColor: '#0000FF',
          }
        })
      })()
    }
  }, [hasBackgroundLocationPermission])

  if (!isTakingPicture) {
    return (
      <SafeAreaView style={styles.container}>
        <BackgroundImage/>
  
        <View style={styles.screenWrapper}>
          <Header title={'Workout'}/>
          <Description
            title={'Get rewarded for working out!'}
            body={`Once per day, when you workout at the gym, you have a chance of winning a reward!`}
          />

          { !fitnessLocation &&
            <>
              <Description
                title={'How to get started'}
                body={`Visit your local gym and send us a picture of it! Once we verify that the location is a gym, you will start receiving rewards for visiting that gym!`}
              />
              <Center>
                <Button text={'Take a Picture'} onPress={takePicture}/>
              </Center>
            </>
          }

          { fitnessLocation && fitnessLocation.isVerified === null &&
            <Description
              title={'Photo awaiting review'}
              body={'A human will review your gym photo soon :)\nThis may take awhile....'}
            />
          }

          { fitnessLocation && fitnessLocation.isVerified === false &&
            <>
              <Description
                title={'Photo verification failed :('}
                body={'We were unable to determine that the photo you sent was a picture of the gym.\n\nPlease try again...'}
              />
              <Center>
                <Button text={'Take a Picture'} onPress={takePicture}/>
              </Center>
            </>
          }

          { fitnessLocation && fitnessLocation.isVerified &&
            <>
              <Description
                title={'Verified'}
                body={'Congrats, visit this fitness location daily for the chance to receive rewards!'}
              />
              <Center>
                <Image
                  source={{ uri: fitnessLocation.imageUri }}
                  style={styles.imageSent}
                />
              </Center>
            </>
          }
        </View>
  
        <BottomBar screen={Screen.Workout} setScreen={setScreen}/>

        <WorkoutReward gameState={gameState} setGameState={setGameState} currentLocation={currentLocation}/>

      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      { !photoAndLocation && hasCameraPermission && hasForegroundLocationPermission && 
        <View style={styles.window}>
          <Camera
            style={styles.window}
            type={Camera.Constants.Type.back}
            ref={(camera) => {
              cameraRef.current = camera
            }}
          />
          <ExitCameraIcon onPress={handleExitCamera}/>
          <View style={styles.cameraActionWrapper}>
            <TouchableOpacity style={styles.snapIcon} onPress={snap}/>
          </View>
        </View>
      }

      { photoAndLocation &&
        <View style={styles.window}>
          <Image
            source={{uri: photoAndLocation.imageUri}}
            style={styles.window}
          />
          <ExitCameraIcon onPress={handleExitCamera}/>
          <View style={styles.cameraActionWrapper}>
            <View style={styles.buttonGroup}>
              <Button text={'Send for Verification'} onPress={sendForVerification}/>
              <Button style={{marginTop: 10}} text={'Retake Photo'} onPress={() => setPhotoAndLocation(undefined)}/>
            </View>
          </View>
        </View>
      }
    </SafeAreaView>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  window: {
    position: 'absolute',
    width: window.width,
    height: window.height,
  },
  xIconWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cameraActionWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  snapIcon: {
    width: window.width / 5,
    height: window.width / 5,
    borderRadius: window.width / 5,
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderWidth: window.width / 100,
    margin: 20,
  },
  buttonGroup: {
    padding: 5,
    borderRadius: 10,
    backgroundColor: colors.white,
    margin: 20,
  },
  imageSent: {
    width: window.width / 2,
    height: window.height / 2,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 5,
  },
})