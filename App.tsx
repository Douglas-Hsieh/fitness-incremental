import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import GoogleFit from 'react-native-google-fit'
import useCachedResources from './hooks/useCachedResources';
import EStyleSheet from 'react-native-extended-stylesheet';
import { GameState } from './assets/data/GameState';
import Screen from './src/enums/Screen';
import { Game } from './src/Game';
import { GOOGLE_FIT_AUTHORIZATION_OPTIONS } from './src/fitness-api/google-fit';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, Text } from 'react-native';
import { registerTasks, unregisterTasks } from './src/background-tasks';
import Center from './src/components/Center';
import { APPLE_HEALTH_AUTHORIZATION_PERMISSIONS } from './src/fitness-api/apple-health-kit';
import AppleHealthKit from 'react-native-health';
import { HighlightableElementProvider } from 'react-native-highlight-overlay';
import { AndroidLoginScreen } from './src/screens/AndroidLoginScreen';
import { IosLoginScreen } from './src/screens/IosLoginScreen';
import { SignInAuth } from './src/types/SignInAuth';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const [screen, setScreen] = useState<Screen>(Screen.Login);
  const [gameState, setGameState] = useState<GameState>();
  const [userInfo, setUserInfo] = useState<SignInAuth>();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    EStyleSheet.build();

    // TODO: Do we need this line
    if (Platform.OS === 'android') {
      GoogleFit.checkIsAuthorized().then(() => {
        setIsAuthorized(GoogleFit.isAuthorized);
      })
    }

    GameState.load().then(gameState => setGameState(gameState));

    unregisterTasks().finally(registerTasks)
  }, [])

  useEffect(() => {
    if (!userInfo) {
      return
    }

    if (Platform.OS === 'android') {
      GoogleFit.authorize(GOOGLE_FIT_AUTHORIZATION_OPTIONS)
        .then(authResult => {
          if (!authResult.success) {
            console.log(`Google Fit authorization failed: ${authResult.message}`)
          }
          setIsAuthorized(authResult.success)
        })
    } else if (Platform.OS === 'ios') {
      AppleHealthKit.initHealthKit(APPLE_HEALTH_AUTHORIZATION_PERMISSIONS, (error) => {
        if (error) {
          console.log('Apple Health Kit authorization failed: Cannot grant permissions!')
        }
        setIsAuthorized(!error)
      })
    }

  }, [userInfo])

  useEffect(() => {
    if (!isAuthorized) {
      return
    }

    if (screen === Screen.Login) {
      setScreen(Screen.WelcomeBack)
    }
  }, [isAuthorized])

  // Autosave game
  useEffect(() => {
    if (gameState) {
      GameState.save(gameState)
    }
  }, [gameState])

  
  if (!isLoadingComplete || !gameState || !userInfo) {
    return (<Center>
      <Text>isLoadingComplete: {(!!isLoadingComplete).toString()}</Text>
      <Text>gameState: {(!!gameState).toString()}</Text>
      <Text>user: {(!!userInfo).toString()}</Text>
    </Center>);
  }

  if (screen === Screen.Login) {
    if (Platform.OS === 'android') {
      return <AndroidLoginScreen
        userInfo={userInfo}
        setUserInfo={setUserInfo}
      />
    } else if (Platform.OS === 'ios') {
      return <IosLoginScreen
        userInfo={userInfo}
        setUserInfo={setUserInfo}
      />
    }
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <HighlightableElementProvider>
        <Game
          screen={screen}
          setScreen={setScreen}
          gameState={gameState}
          setGameState={setGameState as React.Dispatch<React.SetStateAction<GameState>>}
          userInfo={userInfo}
        />
      </HighlightableElementProvider>
    </GestureHandlerRootView>
  )

}

