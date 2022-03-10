import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import GoogleFit from 'react-native-google-fit'
import useCachedResources from './hooks/useCachedResources';
import EStyleSheet from 'react-native-extended-stylesheet';
import { GameState, INITIAL_GAME_STATE } from './assets/data/GameState';
import Screen from './src/enums/Screen';
import { Game } from './src/Game';
import { GOOGLE_FIT_AUTHORIZATION_OPTIONS } from './src/fitness-api/google-fit';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, Text } from 'react-native';
import { registerTasks, unregisterTasks } from './src/background-tasks';
import Center from './src/components/Center';
import { APPLE_HEALTH_AUTHORIZATION_PERMISSIONS } from './src/fitness-api/apple-health-kit';
import AppleHealthKit from 'react-native-health'

export default function App() {
  const isLoadingComplete = useCachedResources();

  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  const [screen, setScreen] = useState<Screen>(Screen.WelcomeBack);
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);

  const requestAuthorization = () => {
    if (Platform.OS === 'android') {
      GoogleFit.authorize(GOOGLE_FIT_AUTHORIZATION_OPTIONS)
        .then(authResult => {
          if (authResult.success) {
            console.log("AUTH_SUCCESS");
          } else {
            console.log("AUTH_DENIED", authResult.message);
            alert('Connect to Google Fit with your Google Account to continue')
          }
          setIsAuthorized(authResult.success)
        })
        .catch(() => {
          console.log("AUTH_ERROR");
        })
    } else if (Platform.OS === 'ios') {
      AppleHealthKit.initHealthKit(APPLE_HEALTH_AUTHORIZATION_PERMISSIONS, (error) => {
        if (error) {
          console.log('[ERROR] Cannot grant permissions!')
        }
        setIsAuthorized(!error)
      })
    }
  }

  useEffect(() => {
    EStyleSheet.build();

    GoogleFit.checkIsAuthorized().then(() => {
      setIsAuthorized(GoogleFit.isAuthorized);
    })

    GameState.load().then(gameState => setGameState(gameState));

    unregisterTasks().finally(registerTasks)
  }, [])

  useEffect(() => {
    if (!isAuthorized) {

      if (Platform.OS === 'android') {
        GoogleFit.authorize(GOOGLE_FIT_AUTHORIZATION_OPTIONS)
          .then(authResult => {
            setIsAuthorized(authResult.success)
          })
      } else if (Platform.OS === 'ios') {
        AppleHealthKit.initHealthKit(APPLE_HEALTH_AUTHORIZATION_PERMISSIONS, (error) => {
          if (error) {
            console.log('[ERROR] Cannot grant permissions!')
          }
          setIsAuthorized(!error)
        })
      }

      return
    }

    if (isAuthorized && screen === Screen.Login) {
      setScreen(Screen.WelcomeBack)
    }
  }, [isAuthorized])

    // Autosave game
    useEffect(() => {
      GameState.save(gameState)
    }, [gameState])
  
  if (!isLoadingComplete || !gameState || !setGameState) {
    return (<Center>
      <Text>isLoadingComplete: {(!!isLoadingComplete).toString()}</Text>
      <Text>gameState: {(!!gameState).toString()}</Text>
      <Text>setGameState: {(!!setGameState).toString()}</Text>
    </Center>);
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Game
        screen={screen}
        setScreen={setScreen}
        gameState={gameState}
        setGameState={setGameState}
        isAuthorized={isAuthorized}
        requestAuthorization={requestAuthorization}
      />
    </GestureHandlerRootView>
  )

}

