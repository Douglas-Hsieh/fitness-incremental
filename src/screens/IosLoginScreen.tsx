import React from "react"
import { SafeAreaView, View, Text } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import colors from "../../assets/colors/colors"
import { Background } from "../components/BackgroundImage"
import { APP_NAME } from "../../assets/data/Constants"
import * as AppleAuth from 'expo-apple-authentication';
import { SignInAuth } from "../types/SignInAuth"

interface IosLoginScreenProps {
  userInfo: SignInAuth | undefined;
  setUserInfo: React.Dispatch<React.SetStateAction<SignInAuth | undefined>>;
}

export const IosLoginScreen = ({userInfo, setUserInfo}: IosLoginScreenProps) => {

  const appleSignIn = async () => {
    try {
      const credential = await AppleAuth.signInAsync({
        requestedScopes: [
          AppleAuth.AppleAuthenticationScope.FULL_NAME,
          AppleAuth.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log('apple credential', credential)
      setUserInfo(credential)
      // signed in
    } catch (error) {
      if (error.code === 'ERR_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Background/>
      
      <View style={styles.screenWrapper}>
        <View style={styles.title}>
          <Text style={styles.titleText}>{APP_NAME}</Text>
        </View>
        <AppleAuth.AppleAuthenticationButton
          buttonType={AppleAuth.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuth.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={5}
          style={{ width: 200, height: 44, }}
          onPress={appleSignIn}
        />
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
    color: colors.black,
    fontSize: '4rem',
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 32,
    height: 32,
  },
  buttonText: {
    marginLeft: 10,
  }
})

