import React, { useEffect, useRef, useState } from "react";
import { GestureResponderEvent, Image, SafeAreaView, StyleSheet, View } from "react-native";
import { GameState } from "../../assets/data/GameState";
import { BackgroundImage } from "../components/BackgroundImage";
import { BottomBar } from "../components/BottomBar";
import { Button } from "../components/Button";
import { Description } from "../components/Description";
import { Header } from "../components/Header";
import Screen from "../enums/Screen";
import { Camera, CameraCapturedPicture } from 'expo-camera';
import { window } from '../util/Window'
import { requestForegroundPermissionsAsync, requestBackgroundPermissionsAsync, getCurrentPositionAsync, LocationObject } from 'expo-location'
import { SERVER_URL } from "../config";
import { uploadAsync, FileSystemUploadType } from 'expo-file-system'
import { Feather } from "@expo/vector-icons";
import Center from "../components/Center";
import colors from "../../assets/colors/colors";
import { TouchableOpacity } from "react-native-gesture-handler";

enum VerificationStatus {
  Unverified,
  AwaitingVerification,
  Verified,
}

interface PhotoAndLocation {
  photo: CameraCapturedPicture;
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
  setGameState: (gameState: GameState) => void;
}

export const WorkoutScreen = ({setScreen, setGameState}: WorkoutScreenProps) => {

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>();
  const cameraRef = useRef<Camera | null>()
  const [hasForegroundLocationPermission, setHasForegroundLocationPermission] = useState<boolean>();
  const [hasBackgroundLocationPermission, setHasBackgroundLocationPermission] = useState<boolean>(true);

  const [isTakingPicture, setIsTakingPicture] = useState<boolean>(false)
  const [photoAndLocation, setPhotoAndLocation] = useState<PhotoAndLocation>();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(VerificationStatus.Unverified);

  
  const takePicture = () => {

    const requestPermissions = (async () => {
      const cameraResponse = await Camera.requestCameraPermissionsAsync()
      setHasCameraPermission(cameraResponse.status === 'granted')

      const foregroundResponse = await requestForegroundPermissionsAsync()
      setHasForegroundLocationPermission(foregroundResponse.status === 'granted')

      // TODO: Background permissions
      // const backgroundResponse = await requestBackgroundPermissionsAsync()
      // setHasBackgroundLocationPermission(backgroundResponse.status === 'granted')
    })
    requestPermissions()

    setIsTakingPicture(true)
  }

  const snap = async () => {
    if (cameraRef.current) {
      const camera = cameraRef.current
      const photo = await camera.takePictureAsync({
        base64: true,
      })
      const location = await getCurrentPositionAsync()
      console.log('photo', photo)
      console.log('Object.keys(photo)', Object.keys(photo))
      console.log('location', location)
      setPhotoAndLocation({
        photo: photo,
        location: location,
      })
    }
  }

  const sendForVerification = async () => {
    // TODO: Upload to api

    if (!photoAndLocation) {
      return
    }

    // const data = new FormData()
    // data.append('name', 'imageName')
    // data.append('type', 'image/jpeg')
    // data.append('uri', photoAndLocation.photo.uri)

    // await fetch(`${SERVER_URL}/api/location`, {
    //   method: 'POST',
    //   body: data,
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // })

    uploadAsync(
      `${SERVER_URL}/api/location`,
      photoAndLocation.photo.uri,
      {
        uploadType: FileSystemUploadType.MULTIPART,
        fieldName: 'files',
        mimeType: 'image/png'
      }
    )

    setIsTakingPicture(false)
    setVerificationStatus(VerificationStatus.AwaitingVerification)

  }

  const handleExitCamera = () => {
    setIsTakingPicture(false)
    setPhotoAndLocation(undefined)
  }

  useEffect(() => {
    // TODO: Check if photo is verified
    setVerificationStatus(VerificationStatus.Verified)
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

          { verificationStatus === VerificationStatus.Unverified &&
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

          { verificationStatus === VerificationStatus.AwaitingVerification &&
            <Description
              title={'Please wait... (this may take awhile)'}
              body={'A human will verify your photo soon :)'}
            />
          }

          { verificationStatus === VerificationStatus.Verified &&
            <Description
              title={'Verified'}
              body={'Congrats, visit this location daily for the chance to receive rewards!'}
            />
          }

        </View>
  
        <BottomBar screen={Screen.Miscellaneous} setScreen={setScreen}/>
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
            source={{uri: 'data:image/jpeg;base64,' + photoAndLocation.photo.base64}}
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
})