import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import GoogleFit from 'react-native-google-fit'
import useCachedResources from './hooks/useCachedResources';
import EStyleSheet from 'react-native-extended-stylesheet';
import { GameState, INITIAL_GAME_STATE } from './assets/data/GameState';
import Screen from './src/enums/Screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Game } from './src/Game';
import { GOOGLE_FIT_AUTHORIZATION_OPTIONS } from './src/google-fit/google-fit';
import { LastVisit } from './assets/data/LastVisit';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { loadLastVisit } from './src/util/loadLastVisit';
import { Text } from 'react-native';
import { registerTasks, unregisterTasks } from './src/background-tasks';
import Center from './src/components/Center';

export default function App() {
  const isLoadingComplete = useCachedResources();

  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [lastVisit, setLastVisit] = useState<LastVisit>()

  const [screen, setScreen] = useState<Screen>(Screen.WelcomeBack);
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);

  const requestAuthorizationFromGoogleFit = () => {
    GoogleFit.authorize(GOOGLE_FIT_AUTHORIZATION_OPTIONS)
      .then(authResult => {
        if (authResult.success) {
          console.log("AUTH_SUCCESS");
          setIsAuthorized(true);
        } else {
          console.log("AUTH_DENIED", authResult.message);
          alert('Connect to Google Fit with your Google Account to continue')
        }
      })
      .catch(() => {
        console.log("AUTH_ERROR");
      })
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
      GoogleFit.authorize(GOOGLE_FIT_AUTHORIZATION_OPTIONS)
        .then(authResult => {
          setIsAuthorized(authResult.success)
        })
      return
    }
    
    loadLastVisit().then(lastVisit => {
      setLastVisit(lastVisit)
      const now = new Date()
      AsyncStorage.setItem('lastVisitTime', now.toISOString())
    })

    if (isAuthorized && screen === Screen.Login) {
      setScreen(Screen.WelcomeBack)
    }
  }, [isAuthorized])

  if (!isLoadingComplete || !gameState || !setGameState || !lastVisit) {
    return (<Center>
      <Text>isLoadingComplete: {(!!isLoadingComplete).toString()}</Text>
      <Text>gameState: {(!!gameState).toString()}</Text>
      <Text>setGameState: {(!!setGameState).toString()}</Text>
      <Text>lastVisit: {(!!lastVisit).toString()}</Text>
    </Center>);
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Game
        screen={screen}
        setScreen={setScreen}
        gameState={gameState}
        setGameState={setGameState}
        lastVisit={lastVisit}
        isAuthorized={isAuthorized}
        requestAuthorizationFromGoogleFit={requestAuthorizationFromGoogleFit}
      />
    </GestureHandlerRootView>
  )

}

