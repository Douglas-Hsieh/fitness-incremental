import React from "react"
import { SafeAreaView, View, Text } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import { TouchableOpacity } from "react-native-gesture-handler"
import colors from "../../assets/colors/colors"
import { BackgroundImage } from "../components/BackgroundImage"

interface LoginScreenProps {
  handleLogin: any;
}

export const LoginScreen = ({handleLogin}: LoginScreenProps) => {
  console.log('LoginScreen render')

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage/>
      
      <View style={styles.screenWrapper}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Fitness Tycoon</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
      </View> 

    </SafeAreaView>
  )
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  titleText: {
    fontFamily: 'oleo-script',
    color: colors.white,
    fontSize: '5rem',
  },
  button: {
    backgroundColor: colors.orange3,
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    fontFamily: 'oleo-script',
    color: colors.white,
    fontSize: '2.5rem',
  }
})

