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
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, LocationObject } from 'expo-location'
import { Feather } from "@expo/vector-icons";
import Center from "../components/Center";
import colors from "../../assets/colors/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { manipulateAsync } from 'expo-image-manipulator'
import { WorkoutReward } from "../components/WorkoutReward";
import { getFitnessLocation, upsertFitnessLocation } from "../api/fitness-locations";
import { FitnessLocation } from '../../../fitness-incremental-shared/src/fitness-location.interface'

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
  setScreen: (screen: Screen) => void;
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
  currentLocation: LocationObject | undefined;
}

export const userId = 'client'

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

  const requestPermissions = (async () => {
    await requestAndSetCameraPermission()
    await requestAndSetForegroundLocationPermission()
    // TODO: Background permissions
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
      console.log('Object.keys(photo)', Object.keys(image))
      console.log('location', location)

      // Compress photo
      const compressedImage = await manipulateAsync(base64ToImageUri(image.base64!), [], { base64: true, compress: 0 });
      console.log('compressedImage.base64?.length', compressedImage.base64?.length)

      setPhotoAndLocation({
        imageUri: base64ToImageUri(image.base64!),
        compressedImageUri: base64ToImageUri(compressedImage.base64!),
        location: location,
      })
    }
  }

  const getAndSetFitnessLocation = async () => {
    getFitnessLocation(userId)
      .then(res => res.json())
      .then(res => setGameState({
        ...gameState,
        fitnessLocation: res.data
      }))
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
      userId: userId,
      coordinates: [longitude, latitude],
      imageUri: photoAndLocation.compressedImageUri,
      isVerified: null,
    }
    upsertFitnessLocation(fitnessLocation)
      .then(getAndSetFitnessLocation)
      .catch(error => {
        alert(error)
      })

    setIsTakingPicture(false)
  }

  const handleExitCamera = () => {
    setIsTakingPicture(false)
    setPhotoAndLocation(undefined)
  }

  useEffect(() => {
    getAndSetFitnessLocation()
  }, [])

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
      { !photoAndLocation && hasCameraPermission && hasForegroundLocationPermission && hasBackgroundLocationPermission && 
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