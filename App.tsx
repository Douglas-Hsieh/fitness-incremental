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
import Center from './src/components/Center';
import { APPLE_HEALTH_AUTHORIZATION_PERMISSIONS } from './src/fitness-api/apple-health-kit';
import AppleHealthKit from 'react-native-health';
import { HighlightableElementProvider } from 'react-native-highlight-overlay';
import { AndroidLoginScreen } from './src/screens/AndroidLoginScreen';
import { IosLoginScreen } from './src/screens/IosLoginScreen';
import { SignInAuth } from './src/types/SignInAuth';
import { FitnessLocation, loadFitnessLocation } from './src/shared/fitness-locations.interface';
import AppContextProvider from './contexts/AppContext';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const [screen, setScreen] = useState<Screen>(Screen.Login);
  const [gameState, setGameState] = useState<GameState>();
  const [fitnessLocation, setFitnessLocation] = useState<FitnessLocation | null>(null);
  const [signInAuth, setSignInAuth] = useState<SignInAuth>();
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
    loadFitnessLocation().then(fitnessLocation => setFitnessLocation(fitnessLocation));

    // Disable local push notifications in favor of remote push notifications.
    // unregisterTasks().finally(registerTasks)
  }, [])

  useEffect(() => {
    if (!signInAuth) {
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

  }, [signInAuth])

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

  if (!isLoadingComplete || !gameState) {
    return (<Center>
      <Text>isLoadingComplete: {(!!isLoadingComplete).toString()}</Text>
      <Text>gameState: {(!!gameState).toString()}</Text>
    </Center>);
  }

  if (screen === Screen.Login) {
    if (Platform.OS === 'android') {
      return <AndroidLoginScreen
        signInAuth={signInAuth}
        setSignInAuth={setSignInAuth}
      />
    } else if (Platform.OS === 'ios') {
      return <IosLoginScreen
        userInfo={signInAuth}
        setUserInfo={setSignInAuth}
      />
    }
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <HighlightableElementProvider>
        <AppContextProvider>
          <Game
            screen={screen}
            setScreen={setScreen}
            gameState={gameState}
            setGameState={setGameState as React.Dispatch<React.SetStateAction<GameState>>}
            fitnessLocation={fitnessLocation}
            setFitnessLocation={setFitnessLocation}
            signInAuth={signInAuth}
          />
        </AppContextProvider>
      </HighlightableElementProvider>
    </GestureHandlerRootView>
  )

}

