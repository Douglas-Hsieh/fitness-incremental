import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import GoogleFit, { Scopes } from 'react-native-google-fit'
import { HomeScreen } from './src/screens/HomeScreen';

const {Navigator, Screen} = createNativeStackNavigator();

export default function App() {

  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [steps, setSteps] = useState<number>();


  useEffect(() => {
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

  return <NavigationContainer>
    <Navigator>
      <Screen name='Home' component={HomeScreen} options={{headerShown: false}}/>
      {/* <Screen name='Stats' component={StatsScreen} options={{headerShown: false}}></Screen> */}
    </Navigator>
  </NavigationContainer>

}

