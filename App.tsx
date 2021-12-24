import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import GoogleFit from 'react-native-google-fit'
import useCachedResources from './hooks/useCachedResources';
import EStyleSheet from 'react-native-extended-stylesheet';
import { GameState, INITIAL_GAME_STATE } from './assets/data/GameState';
import Screen from './src/enums/Screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Game } from './src/Game';
import { getStepsBetween, GOOGLE_FIT_AUTHORIZATION_OPTIONS } from './src/google-fit/google-fit';
import { LastVisit } from './assets/data/LastVisit';

export default function App() {
  const isLoadingComplete = useCachedResources();

  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [lastVisit, setLastVisit] = useState<LastVisit>()

  const [screen, setScreen] = useState<Screen>(Screen.Login);
  const [gameState, setGameState] = useState<GameState>();

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

  const getAndSetLastVisit = async () => {
    // Get time of user's last visit
    const lastVisitTimeString = await AsyncStorage.getItem('lastVisitTime')
    const now = new Date()
    console.log('lastVisitTimeString', lastVisitTimeString)
    const lastVisitTime = lastVisitTimeString ? new Date(lastVisitTimeString) : now

    const lastVisitSteps = await getStepsBetween(lastVisitTime, now)
    
    setLastVisit({
      time: lastVisitTime,
      steps: lastVisitSteps,
    })

    // Update time of last visit
    await AsyncStorage.setItem('lastVisitTime', now.toISOString())
  }

  useEffect(() => {
    EStyleSheet.build();

    GoogleFit.checkIsAuthorized().then(() => {
      setIsAuthorized(GoogleFit.isAuthorized);
    })

    const getAndSetGameState = async () => {
      const gameStateString = await AsyncStorage.getItem('gameState')
      // const gameState = gameStateString ? JSON.parse(gameStateString) as GameState : INITIAL_GAME_STATE
      const gameState = gameStateString ? GameState.fromJson(gameStateString) : INITIAL_GAME_STATE
      console.log('gameState', gameState)
      setGameState(gameState)
    }
    getAndSetGameState()
  }, [])

  useEffect(() => {
    if (!isAuthorized) {
      GoogleFit.authorize(GOOGLE_FIT_AUTHORIZATION_OPTIONS)
        .then(authResult => {
          setIsAuthorized(authResult.success)
        })
      return
    }
    
    getAndSetLastVisit()

    if (isAuthorized && screen === Screen.Login) {
      setScreen(Screen.WelcomeBack)
    }
  }, [isAuthorized])

  if (!isLoadingComplete || !gameState || !lastVisit) {
    return null;
  }

  return (
    <Game
      screen={screen}
      setScreen={setScreen}
      gameState={gameState}
      setGameState={setGameState}
      lastVisit={lastVisit}
      isAuthorized={isAuthorized}
      requestAuthorizationFromGoogleFit={requestAuthorizationFromGoogleFit}
    />
  )

}

