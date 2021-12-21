import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import GoogleFit, { Scopes } from 'react-native-google-fit'
import { HomeScreen } from './src/screens/HomeScreen';
import useCachedResources from './hooks/useCachedResources';
import { UpgradesScreen } from './src/screens/UpgradesScreen';
import EStyleSheet from 'react-native-extended-stylesheet';
import { WelcomeBackScreen } from './src/screens/WelcomeBackScreen';
import { GameState, INITIAL_GAME_STATE } from './assets/data/GameState';
import Screen from './src/enums/Screen';
import { UnlocksScreen } from './src/screens/UnlocksScreen';
import { PrestigeScreen } from './src/screens/PrestigeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GOOGLE_FIT_AUTHORIZATION_OPTIONS = {
  scopes: [
    Scopes.FITNESS_ACTIVITY_READ,
    Scopes.FITNESS_ACTIVITY_WRITE,
    Scopes.FITNESS_BODY_READ,
    Scopes.FITNESS_BODY_WRITE,
  ],
}

export default function App() {
  const isLoadingComplete = useCachedResources();

  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  const [screen, setScreen] = useState<Screen>(Screen.WelcomeBack);
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [stepsTodayLastVisit, setStepsTodayLastVisit] = useState<number>(0);
  const [stepsToday, setStepsToday] = useState<number>(0)


  useEffect(() => {
    EStyleSheet.build();

    GoogleFit.checkIsAuthorized().then(() => {
      console.log(GoogleFit.isAuthorized)
      setIsAuthorized(GoogleFit.isAuthorized);
    })
  }, [])

  useEffect(() => {
    if (!GoogleFit.isAuthorized) {
      GoogleFit.authorize(GOOGLE_FIT_AUTHORIZATION_OPTIONS)
        .then(authResult => {
          if (authResult.success) {
            console.log("AUTH_SUCCESS");
            setIsAuthorized(true);
          } else {
            console.log("AUTH_DENIED", authResult.message);
          }
        })
        .catch(() => {
          console.log("AUTH_ERROR");
        })
    } else {

      // Client authorized to use Google Fit
      const getAndSet = async () => {

        const getAndSetStepsTodayLastVisit = async () => {
          const stepsTodayLastVisitString = await AsyncStorage.getItem('stepsToday')
          const stepsTodayLastVisit = stepsTodayLastVisitString ? JSON.parse(stepsTodayLastVisitString) as number : 0
          setStepsTodayLastVisit(stepsTodayLastVisit)
          console.log('stepsTodayLastVisit', stepsTodayLastVisit)
        }
        await getAndSetStepsTodayLastVisit()
  
        const getAndSetStepsToday = async () => {
          const date = new Date();
          GoogleFit.getDailySteps(date)
            .then(stepsResponseList => {
              const stepsResponse = stepsResponseList.find(stepsResponse => stepsResponse.source === 'com.google.android.gms:estimated_steps');
              if (stepsResponse && stepsResponse.steps.length > 0) {
                const stepsToday = stepsResponse.steps[0].value
                setStepsToday(stepsToday)
                console.log('stepsToday', stepsToday);
                AsyncStorage.setItem('stepsToday', JSON.stringify(stepsToday))
              }
            })
            .catch(error => console.log(error))
        }
        await getAndSetStepsToday()
      }
      getAndSet()
    }
  }, [isAuthorized])


  if (!isLoadingComplete) {
    return null;
  }

  switch(screen) {
    case Screen.WelcomeBack: 
      return (
        <WelcomeBackScreen
          setScreen={setScreen}
          stepsTodayLastVisit={stepsTodayLastVisit}
          stepsToday={stepsToday}
        />
      )
    case Screen.Home:
      return (
        <HomeScreen
          setScreen={setScreen}
          gameState={gameState}
          setGameState={setGameState}
        />
      )
    case Screen.Upgrades:
      return (
        <UpgradesScreen
          setScreen={setScreen}
          gameState={gameState}
          setGameState={setGameState}
        />
      )
    case Screen.Unlocks:
      return (
        <UnlocksScreen
          setScreen={setScreen}
          gameState={gameState}
        />
      )
    case Screen.Prestige:
      return (
        <PrestigeScreen
          setScreen={setScreen}
          gameState={gameState}
          setGameState={setGameState}
        />
      )



  }

}

