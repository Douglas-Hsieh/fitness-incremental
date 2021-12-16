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

export default function App() {
  const isLoadingComplete = useCachedResources();

  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [steps, setSteps] = useState<number>();

  const [screen, setScreen] = useState<Screen>(Screen.WelcomeBack);
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);


  useEffect(() => {
    EStyleSheet.build();

    GoogleFit.checkIsAuthorized().then(() => {
      console.log(GoogleFit.isAuthorized) // Then you can simply refer to `GoogleFit.isAuthorized` boolean.
      setIsAuthorized(GoogleFit.isAuthorized);
    })
  }, [])

  useEffect(() => {
    if (!GoogleFit.isAuthorized) {
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
          Scopes.FITNESS_ACTIVITY_WRITE,
          Scopes.FITNESS_BODY_READ,
          Scopes.FITNESS_BODY_WRITE,
        ],
      }
      GoogleFit.authorize(options)
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
      const date = new Date();
      GoogleFit.getDailySteps(date)
        .then(stepsResponseList => {
          const stepsResponse = stepsResponseList.find(stepsResponse => stepsResponse.source === 'com.google.android.gms:estimated_steps');
          if (stepsResponse) {
            console.log('Steps taken today: ', stepsResponse.steps[0].value);
            setSteps(stepsResponse.steps[0].value);
          }
        })
        .catch(error => console.log(error))
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



  }

}

